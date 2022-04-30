import { Injectable } from '@nestjs/common';
import { modelWithCategoriesAndBrands, ProductWithModelsAndCategories } from 'src/app.type-constants';
import { ProductDto } from 'src/modules/cart/dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}
  getAds(): Promise<ProductDto[]> {
    return this.fetchAds();
  }

  getAdsById(adId: number) {
    console.log('adId', adId);
    return this.fetchAds(adId);
  }

  private async fetchAds(...adIdArray: number[]) {
    let whereClause = {};
    if (adIdArray?.length > 0) {
      whereClause = { ...whereClause, id: { in: adIdArray } };
    }
    const products: ProductWithModelsAndCategories[] = await this.prisma.products.findMany({
      where: whereClause,
      orderBy: [
        {
          id: 'desc',
        },
      ],
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
        product_specs: true,
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
        model: modelWithCategoriesAndBrands,
      },
    });
    const ads = products.map((product) => {
      return this.formatProducts(product);
    });
    return ads;
  }

  formatProducts(product: ProductWithModelsAndCategories): ProductDto {
    let images = product?.product_images?.map((image) => {
      return { url: image.url };
    });
    return new ProductDto({
      adId: product.id, // ok
      imageUrl: product && product.product_images && product?.product_images[0].url, // ok
      numOrders: product?.numOrders, // ok
      quantity: product?.totalAmount,
      _normalPrice: product?.normalPrice,
      _instantPrice: product?.instantPrice,
      modelId: product?.modelId, // ok
      brandName: product.model.brands.name, // ok
      brandId: product.model.brandId, // ok
      modelName: product.model.name, // ok
      categoryName: product?.model?.categories.name, // ok
      categoryId: product?.model?.categoryId, // ok
      sellerId: product?.seller_productsToseller?.id, // ok
      sellerName: product.seller_productsToseller?.name, // ok
      sellerLogo: product.seller_productsToseller?.marketplaceLogo, // ok
      sellerMarketPlaceName: product?.seller_productsToseller?.marketplaceName, // ok
      description: product.description,
      parentId: product.model.categories.parrent,
      endDate: product.endDate,
      createdDate: product.startDate,
      maxDiscountPercent: product.maxDiscount,
      maxParticipants: product.maxAmount,
      minParticipants: product.minAmount,
      _targetPrice: product?.targetPrice,
      _downpayment: product?.downpayment,
      _listingPrice: product?.listingPrice,
      specs: product.product_specs,
      // images,
      _instantDiscountPercent: product.instantDiscountPercent,
      participants: product.participants,
    });
  }
}
