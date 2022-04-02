import { Prisma } from '@prisma/client';

export const cartWithCartItems =
  Prisma.validator<Prisma.UserCartArgs>()({
    select: {
      id: true,
      uuid: true,
      userId: true,
      status: true,
      subTotal: true,
      dateCreated: true,
      dateUpdated: true,
      invoiceId: true,
      paymentId: true,
      addressId: true,
      user_cart_items: true,
      user_chart_seller_ratings: true,
    },
  });

export const cartItemsWithProducts =
  Prisma.validator<Prisma.UserCartItemsArgs>()({
    select: {
      id: true,
      cartId: true,
      productId: true,
      amount: true,
      totalPrice: true,
      paymentId: true,
      block: true,
      dateCreated: true,
      dateUpdated: true,
      deliveryStatus: true,
      products: {
        select: {
          id: true,
          seller: true,
          description: true,
          startDate: true,
          endDate: true,
          minAmount: true,
          maxAmount: true,
          totalAmount: true,
          maxDiscount: true,
          discountStep: true,
          normalPrice: true,
          listingPrice: true,
          numOrders: true,
          participants: true,
          instantDiscountPercent: true,
          instantPrice: true,
          targetPrice: true,
          product_images: {
            select: {
              url: true,
            },
          },
          product_reviews: true,
          seller_productsToseller: true,
          product_questions: true,
          product_specs: true,
          model: {
            select: {
              id: true,
              name: true,
              brandId: true,
              categoryId: true,
              categories: {
                select: {
                  id: true,
                  name: true,
                },
              },
              brands: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

export type CartItemsWithProducts =
  Prisma.UserCartItemsGetPayload<
    typeof cartItemsWithProducts
  >;

export type CartWithCartItems =
  Prisma.UserCartGetPayload<
    typeof cartWithCartItems
  >;

export const productWithModelsAndCategories =
  Prisma.validator<Prisma.productsArgs>()({
    select: {
      id: true,
      seller: true,
      modelId: true,
      description: true,
      startDate: true,
      endDate: true,
      minAmount: true,
      maxAmount: true,
      totalAmount: true,
      maxDiscount: true,
      discountStep: true,
      normalPrice: true,
      listingPrice: true,
      numOrders: true,
      participants: true,
      instantDiscountPercent: true,
      instantPrice: true,
      targetPrice: true,
      downpayment: true,
      blockingStock: true,
      product_reviews: true,
      product_images: {
        select: {
          url: true,
        },
      },
      seller_productsToseller: {
        select: {
          id: true,
          name: true,
          marketplaceName: true,
          marketplaceLogo: true,
          marketplaceUuid: true,
        },
      },
      model: {
        select: {
          id: true,
          name: true,
          brandId: true,
          categoryId: true,
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          brands: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

export type ProductWithModelsAndCategories =
  Prisma.productsGetPayload<
    typeof productWithModelsAndCategories
  >;
