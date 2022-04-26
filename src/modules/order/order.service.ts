import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserChartSellerRatings } from '@prisma/client';
import { cartItemsWithProducts } from 'src/app.type-constants';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { CancelProductDto, RateItemDto, RateSellerDto, Rating } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  async rateItem(id: number, dto: RateItemDto) {
    const { cartId, adId, comment, rating } = dto;
    const cart = await this.cartService.CartFindOne(cartId, null, id);
    if (!cart) throw new HttpException('Böyle bir ürün bulunmamaktadır!', HttpStatus.BAD_REQUEST);
    try {
      await this.prisma.productReviews.create({
        data: {
          productId: adId,
          userId: id,
          reviewContent: comment,
          reviewStars: rating,
        },
      });
    } catch (err) {
      throw new HttpException('Ürünü değerlendirirken bir hata oluştu!', HttpStatus.BAD_REQUEST);
    }
  }

  async rateSeller(id: number, dto: RateSellerDto) {
    const { cartId, sellerId, ratings } = dto;
    const cart = await this.cartService.CartFindOne(cartId, 1, id);
    if (!cart) throw new HttpException('Böyle bir sipariş bulunmamaktadır!', HttpStatus.BAD_REQUEST);
    const ratingsArray = this.createRatingsArray(cart.id, sellerId, ratings);
    try {
      await this.prisma.userChartSellerRatings.createMany({
        data: ratingsArray,
      });
    } catch (err) {
      throw new HttpException('Satıcıyı değerlendirirken bir hata oluştu!', HttpStatus.BAD_REQUEST);
    }
  }
  private createRatingsArray(cartId: number, sellerId: number, ratings: Rating[]): UserChartSellerRatings[] {
    let ratingsArray: any[] = [];
    ratings.map((item: Rating) => {
      let obj = {
        cartId,
        sellerId,
        ratingValueId: item.id,
        value: item.value.toString(),
        date: new Date(Date.now()),
      };
      ratingsArray.push(obj);
    });
    return ratingsArray;
  }

  async cancelProduct(userId: number, dto: CancelProductDto) {
    const { cartId, notes, reasonId, returnAmount } = dto;
    const result = await this.prisma.userCartItemReturnRequests.create({
      data: {
        userCartItemId: cartId,
        returnReasonId: reasonId,
        returnAmount,
        date: new Date(Date.now()),
        status: 'created',
        notes,
      },
    });
    if (!result) throw new HttpException('Ürün iptal işlemi sırasında hata oluştu!', HttpStatus.BAD_REQUEST);
    return;
  }

  async createOrder(userId: number, dto: CreateOrderDto) {
    const { id, shippingAddressId, billingAddressId } = dto;
    // const cart = this.cartService.CartFindOne(id,1,userId)
    const cart = await this.prisma.userCart.findFirst({
      where: {
        id,
        userId,
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
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdDate: true,
            email: true,
            createdIp: true,
            user_address: {
              where: {
                id: {
                  in: [shippingAddressId, billingAddressId],
                },
              },
            },
          },
        },
      },
    });
    if (!cart) throw new HttpException('Böyle bir sipariş bulunmamaktadır!', HttpStatus.BAD_REQUEST);
  }

  retrieve() {
    throw new Error('Method not implemented.');
  }
}
