import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, products, UserCart, UserCartItems } from '@prisma/client';
import { equals } from 'class-validator';
import { CartItemsWithProducts, cartItemsWithProducts, cartWithCartItems, CartWithCartItems, ProductWithModelsAndCategories } from 'src/app.type-constants';

import { PrismaService } from '../prisma/prisma.service';
import { CartRequestDto, ProductDto, ReturnsDto, UserCartInfoResponseDto, UserCartItemResponseDto, UserCartResponseDto } from './dto';

const emptyCart = {
  info: {},
  items: [],
  ratings: [],
  taxes: [],
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async cartGet(id: number, dto: CartRequestDto) {
    const cart = await this.CartFindOne(dto.cartId, dto.isOrder, id);
    if (!cart) return emptyCart;
    return this.formatCart(cart);
  }

  async cartUpdate(id: number, dto: CartRequestDto): Promise<CartWithCartItems | any> {
    const { cartId, adId, amount } = dto;
    try {
      const product = await this.prisma.products.findUnique({
        where: {
          id: adId,
        },
      });

      const cart: CartWithCartItems = await this.CartFindOne(cartId, null, id);
      let newCart: CartWithCartItems;
      let remainingNumOfItemsInStock = product.totalAmount - (product.numOrders + product.blockingStock);

      if (!cart) {
        this.checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock, amount);
        newCart = await this.createNewCart(id, product, amount); // return newCart
      } else {
        const cartItemsLength: number = cart.user_cart_items?.length;
        const cartItem: CartItemsWithProducts = cart.user_cart_items.find((item: CartItemsWithProducts) => {
          item.products.id === adId;
        });
        if (!cartItem) {
          if (amount <= 0) throw new HttpException('Girdiğiniz adet geçersiz!', HttpStatus.BAD_REQUEST);
          this.checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock, amount);
          await this.createNewCartItem(cart.id, product.id, amount);
          this.updateCartSubtotal(cart.id, cart.subTotal, cartItem.products.normalPrice, amount);
        } else {
          if (amount < 0) throw new HttpException('Girdiğiniz adet geçersiz!', HttpStatus.BAD_REQUEST);
          if (amount === 0) {
            if (cartItemsLength === 1) {
              await this.prisma.userCart.delete({
                where: {
                  id: cart.id,
                },
              });
              return emptyCart;
            }
            var diff = amount - cartItem.amount;
            await this.updateCartSubtotal(cart.id, cart.subTotal, cartItem.products.normalPrice, diff);
            await this.prisma.userCartItems.delete({
              where: {
                id: cartItem.id,
              },
            });
          } else {
            this.checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock, amount);
            let diff = amount - cartItem.amount;
            await this.prisma.userCartItems.update({
              data: {
                amount,
              },
              where: {
                id: cartItem.id,
              },
            });
            await this.updateCartSubtotal(cart.id, cart.subTotal, cartItem.products.normalPrice, diff);
          }
        }
        newCart = await this.CartFindOne(cart.uuid, null, id);
      }
      return this.formatCart(newCart);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCartSubtotal(cartId: number, cartSubTotal: number, normalPrice: number, amount: number) {
    let newItemPrice = amount * normalPrice;
    await this.prisma.userCart.update({
      data: {
        subTotal: cartSubTotal + newItemPrice,
      },
      where: {
        id: cartId,
      },
    });
  }

  async createNewCartItem(cartId: number, productId: number, amount: number) {
    await this.prisma.userCartItems.create({
      data: {
        cartId,
        productId,
        amount: amount,
        paymentId: null,
        block: 0,
        dateCreated: new Date(Date.now()),
        dateUpdated: new Date(Date.now()),
        deliveryStatus: 'created',
      },
    });
  }

  private async createNewCart(id: number, product: products, amount: number): Promise<CartWithCartItems> {
    const subTotal = amount * product.normalPrice;
    return await this.prisma.userCart.create({
      data: {
        userId: id,
        status: 'created',
        subTotal,
        dateCreated: new Date(Date.now()),
        dateUpdated: new Date(Date.now()),
        invoiceId: null,
        paymentId: null,
        addressId: null,
        totalTax: null,
        user_cart_items: {
          create: {
            productId: product.id,
            amount: amount,
            paymentId: null,
            block: 0,
            dateCreated: new Date(Date.now()),
            dateUpdated: new Date(Date.now()),
            deliveryStatus: 'created',
          },
        },
      },
      select: {
        id: true,
        uuid: true,
        userId: true,
        totalTax: true,
        subTotal: true,
        invoiceId: true,
        dateCreated: true,
        dateUpdated: true,
        status: true,
        addressId: true,
        paymentId: true,
        user_cart_items: cartItemsWithProducts,
        user_chart_seller_ratings: true,
      },
    });
  }
  private checkRemainingNumOfItemsInStock(remainingNumOfItemsInStock: number, amount: number) {
    if (remainingNumOfItemsInStock <= 0) {
      throw new HttpException('Bü ürün tükenmiştir!', HttpStatus.FORBIDDEN);
    }
    if (amount > remainingNumOfItemsInStock) {
      throw new HttpException(`Bu üründen maksimum ${remainingNumOfItemsInStock} adet alabilirsiniz!`, HttpStatus.FORBIDDEN);
    }
  }
  getCartList(id: number) {
    return this.CartFindMany(id);
  }

  getRatingForm() {
    return this.prisma.ratingValues.findMany();
  }

  getReturnReasons() {
    return this.prisma.returnReasons.findMany();
  }

  private formatCart(cart: CartWithCartItems) {
    let totalProfit = 0;
    const userCartItems: UserCartItemResponseDto[] = cart?.user_cart_items?.map((item: CartItemsWithProducts) => {
      let profit: number = (item.amount * (item.products?.normalPrice - item.products?.instantPrice)) / 100;
      totalProfit += profit;
      return this.formatCartItem(item, profit);
    });

    return new UserCartResponseDto({
      info: this.formatCartInfo(cart, totalProfit),
      items: userCartItems,
      taxes: [],
      ratings: this.getUnique(cart?.user_chart_seller_ratings),
    });
  }
  private getUnique(sellerRatings: any[]) {
    let arr1 = sellerRatings?.map((item) => item.sellerId);
    let res1 = arr1.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    return res1;
  }

  async CartFindOne(cartId: string | null | undefined, isOrder: number | null = null, id: number): Promise<CartWithCartItems> {
    const result = await this.prisma.userCart.findFirst({
      where: {
        uuid: cartId || null || undefined,
        userId: 23, //değişecek = id
        status:
          isOrder === 0 || isOrder === null
            ? {
                in: ['created', 'blocking'],
              }
            : {
                in: ['paid', 'preparing', 'delivering', 'delivered', 'canceled', 'refunded'],
              },
      },
      select: {
        id: true,
        uuid: true,
        userId: true,
        totalTax: true,
        subTotal: true,
        invoiceId: true,
        dateCreated: true,
        dateUpdated: true,
        status: true,
        addressId: true,
        paymentId: true,
        user_cart_items: cartItemsWithProducts,
        user_chart_seller_ratings: true,
      },
    });
    return result;
  }

  private async CartFindMany(id: number) {
    const userCarts: CartWithCartItems[] = await this.prisma.userCart.findMany({
      where: {
        userId: 23,
        status: {
          in: ['paid'],
        },
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
      select: {
        id: true,
        uuid: true,
        userId: true,
        totalTax: true,
        subTotal: true,
        invoiceId: true,
        dateCreated: true,
        dateUpdated: true,
        status: true,
        addressId: true,
        paymentId: true,
        user_cart_items: cartItemsWithProducts,
        user_chart_seller_ratings: true,
      },
    });
    return this.formatUserCartInfoItems(userCarts);
  }

  private formatUserCartInfoItems(userCarts: CartWithCartItems[]) {
    return userCarts?.map((cart: any) => {
      let totalProfit = 0;
      cart?.user_cart_items.map((item: CartItemsWithProducts) => {
        let profit = item.amount * (item.products?.normalPrice - item.products?.instantPrice);
        return (totalProfit += profit);
      });
      return this.formatCartInfo(cart, totalProfit);
    });
  }

  private formatCartInfo(cart: any, totalProfit: number) {
    return new UserCartInfoResponseDto({
      id: cart.id,
      uuid: cart.uuid,
      _subTotal: cart.subTotal,
      _totalProfit: totalProfit,
      invoiceId: cart.invoiceId,
      shippingId: cart.addressId,
      status: cart.status,
      _dateCreated: cart.dateCreated,
    });
  }

  private formatCartItem(item: any, profit: number): UserCartItemResponseDto {
    let numOfReturnedItems = 0;
    const returns: ReturnsDto[] = item.user_cart_item_return_requests?.map((returnItem: ReturnsDto) => {
      numOfReturnedItems += returnItem?.returnAmount | 0;
      return {
        id: returnItem?.id,
        returnAmount: returnItem?.returnAmount,
        date: returnItem?.date,
        status: returnItem?.status,
      };
    });
    let reviewAvailable = item.product?.product_reviews?.length > 0 ? false : true;
    return new UserCartItemResponseDto({
      id: item?.id,
      adId: item.product?.id,
      _totalPrice: item.totalPrice,
      _dateCreated: item.dateCreated,
      cartId: item.cartId,
      reviewAvailable,
      amount: item.amount,
      _profit: profit,
      returnableAmount: item.amount - numOfReturnedItems,
      returns: returns,
      product: this.formatProducts(item?.products),
      deliveryStatus: item.deliveryStatus,
    });
  }

  private formatProducts(product: ProductWithModelsAndCategories): ProductDto {
    return new ProductDto({
      adId: product.id,
      imageUrl: product && product.product_images && product?.product_images[0].url,
      numOrders: product?.numOrders,
      quantity: product?.totalAmount,
      _normalPrice: product?.normalPrice,
      _instantPrice: product?.instantPrice,
      modelId: product?.modelId,
      brandName: product.model.brands.name,
      brandId: product.model.brandId,
      modelName: product.model.name,
      categoryName: product?.model?.categories.name,
      categoryId: product?.model?.categoryId,
      sellerId: product?.seller_productsToseller?.id,
      sellerName: product.seller_productsToseller?.name,
      sellerLogo: product.seller_productsToseller?.marketplaceLogo,
      sellerMarketPlaceName: product?.seller_productsToseller?.marketplaceName,
      description: product.description,
    });
  }
}
