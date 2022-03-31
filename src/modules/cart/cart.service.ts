import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCartInfoResponseDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartList(id: number) {
    const userCart = await this.fetchUserCart(id);
    console.log('usercart', userCart);
    return userCart;
  }

  getRatingForm() {
    return this.prisma.ratingValues.findMany();
  }

  getReturnReasons() {
    return this.prisma.returnReasons.findMany();
  }

  private async fetchUserCart(id: number) {
    const userCarts =
      await this.prisma.userCart.findMany({
        where: {
          userId: 129,
          status: 'paid',
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

    const result = userCarts?.map((cart) => {
      let totalProfit = 0;
      const userCartItems = cart?.user_cart_items;
      userCartItems.map((item) => {
        let profit =
          item.amount *
          (item.products.normalPrice -
            item.products.instantPrice);
        return (totalProfit += profit);
      });
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
    });
    return result;
  }

  private formattedPrice() {}
}
