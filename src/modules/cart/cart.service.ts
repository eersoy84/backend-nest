import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CartRequestDto,
  ReturnsDto,
  UserCartInfoResponseDto,
  UserCartItemResponseDto,
  UserCartResponseDto,
} from './dto';

let emptyCart = {
  info: {},
  items: [],
  ratings: [],
  taxes: [],
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async cartGet(id: number, dto: CartRequestDto) {
    const cart = await this.userCartFindOne(
      dto.cartId,
      dto.isOrder,
      id,
    );
    if (!cart) return emptyCart;
    return this.formatUserCart(cart);
  }

  getCartList(id: number) {
    return this.fetchUserCart(id);
  }

  getRatingForm() {
    return this.prisma.ratingValues.findMany();
  }

  getReturnReasons() {
    return this.prisma.returnReasons.findMany();
  }

  private formatUserCart(cart: any) {
    let totalProfit = 0;
    const userCartItems: UserCartItemResponseDto[] =
      cart?.user_cart_items?.map((item: any) => {
        let profit: any =
          (item.amount *
            (item.products?.normalPrice -
              item.product?.instantPrice)) /
          100;
        totalProfit += profit;
        return this.formatUserCartItem(
          item,
          profit,
        );
      });

    return new UserCartResponseDto({
      info: this.formatUserCartInfo(cart, 0),
      items: userCartItems,
      taxes: [],
      // ratings: this.getUnique(
      //   cart?.user_chart_seller_ratings,
      // ),
    });
  }
  private getUnique(sellerRatings: any[]) {
    let arr1 = sellerRatings?.map(
      (item) => item.seller_id,
    );
    let res1 = arr1.filter(
      (value, index, self) => {
        return self.indexOf(value) === index;
      },
    );
    return res1;
  }

  private async userCartFindOne(
    cartId: string | null,
    isOrder: number | null,
    id: number,
  ) {
    const result =
      await this.prisma.userCart.findFirst({
        where: {
          uuid: cartId || null || undefined,
          userId: 129, //değişecek = id
        },
        select: {
          id: true,
          uuid: true,
          subTotal: true,
          invoiceId: true,
          dateCreated: true,
          dateUpdated: true,
          status: true,
          addressId: true,
          user_cart_items: {
            select: {
              id: true,
              cartId: true,
              amount: true,
              totalPrice: true,
              dateCreated: true,
              deliveryStatus: true,
              products: {
                select: {
                  id: true,
                  normalPrice: true,
                  instantPrice: true,
                  totalAmount: true,
                  numOrders: true,
                  product_reviews: {
                    where: {
                      userId: 129, //değişecek = id
                    },
                    select: {
                      productId: true,
                      userId: true,
                    },
                  },
                  product_images: {
                    select: {
                      url: true,
                    },
                  },
                  seller: true,
                  model: {
                    select: {
                      categories: true,
                      brands: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    return result;
  }

  private async fetchUserCart(id: number) {
    const userCarts =
      await this.prisma.userCart.findMany({
        where: {
          userId: 129,
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
          subTotal: true,
          invoiceId: true,
          dateCreated: true,
          dateUpdated: true,
          status: true,
          addressId: true,
          user_cart_items: {
            select: {
              id: true,
              cartId: true,
              amount: true,
              totalPrice: true,
              dateCreated: true,
              products: {
                select: {
                  id: true,
                  normalPrice: true,
                  instantPrice: true,
                },
              },
            },
          },
        },
      });
    return this.formatUserCartInfoItems(
      userCarts,
    );
  }

  private formatUserCartInfoItems(
    userCarts: any,
  ) {
    return userCarts?.map((cart: any) => {
      let totalProfit = 0;
      const userCartItems = cart?.user_cart_items;
      userCartItems?.map((item: any) => {
        let profit =
          item.amount *
          (item.products?.normalPrice -
            item.products?.instantPrice);
        return (totalProfit += profit);
      });
      return this.formatUserCartInfo(
        cart,
        totalProfit,
      );
    });
  }
  private formatUserCartInfo(
    cart: any,
    totalProfit: number,
  ) {
    return new UserCartInfoResponseDto({
      id: cart.id,
      uuid: cart.uuid,
      subTotal: cart.subTotal,
      _totalProfit: totalProfit,
      invoiceId: cart.invoiceId,
      shippingId: cart.addressId,
      status: cart.status,
      _dateCreated: cart.dateCreated,
    });
  }

  private formatUserCartItem(
    item: any,
    profit: number,
  ): UserCartItemResponseDto {
    let numOfReturnedItems = 0;
    const returns =
      item.user_cart_item_return_requests?.map(
        (returnItem: ReturnsDto) => {
          numOfReturnedItems +=
            returnItem?.returnAmount | 0;
          return {
            id: returnItem?.id,
            returnAmount:
              returnItem?.returnAmount,
            date: returnItem?.date,
            status: returnItem?.status,
          };
        },
      );
    let reviewAvailable =
      item.product?.product_reviews?.length > 0
        ? false
        : true;
    return new UserCartItemResponseDto({
      id: item?.id,
      adId: item.product?.id,
      totalPrice: item.totalPrice,
      _dateCreated: item.dateCreated,
      cartId: item.cartId,
      reviewAvailable,
      amount: item.amount,
      _profit: profit,
      returnableAmount:
        item.amount - numOfReturnedItems,
      returns: returns,
      deliveryStatus: item.delivery_status,
    });
  }
}
