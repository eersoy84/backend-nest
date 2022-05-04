import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, UserFavorites } from '@prisma/client';
import { modelWithCategoriesAndBrands, ProductWithModelsAndCategories } from 'src/app.type-constants';
import { ProductDto } from 'src/modules/cart/dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { FollowDto } from './dto';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

  async getInstantAdInfo(): Promise<ProductDto[]> {
    const instantAds: any[] = await this.prisma.products.findMany({
      select: {
        id: true,
        numOrders: true,
        instantDiscountPercent: true,
        instantPrice: true,
        participants: true,
      },
    });
    if (!instantAds || instantAds.length === 0) {
      throw new HttpException('İlanlarla ilgili anlık veriler bulunamadı!', HttpStatus.NOT_FOUND);
    }
    return instantAds.map((item) => {
      return new ProductDto(item);
    });
  }

  getAds(): Promise<ProductDto[]> {
    return this.fetchAds();
  }

  getAdsById(adId: number): Promise<ProductDto[]> {
    return this.fetchAds(adId);
  }

  async getFavorites(userId: number): Promise<ProductDto[]> {
    const favorites: UserFavorites[] = await this.prisma.userFavorites.findMany({
      where: {
        userId,
      },
    });
    const adIdArray: number[] = favorites.map((favorite) => favorite.productId);
    if (adIdArray?.length === 0) return [];
    return await this.fetchAds(...adIdArray);
  }

  async unfollow(userId: number, dto: FollowDto): Promise<ProductDto[]> {
    try {
      await this.prisma.userFavorites.delete({
        where: {
          productId_userId: {
            productId: dto.productId,
            userId,
          },
        },
      });
      return this.getFavorites(userId);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Böyle bir ilan bulunmamaktadır!', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  async follow(userId: number, dto: FollowDto): Promise<ProductDto[]> {
    try {
      await this.prisma.userFavorites.create({
        data: {
          productId: dto.productId,
          userId,
        },
      });
      return this.getFavorites(userId);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new HttpException('Bu ilanı zaten takip ediyordunuz!', HttpStatus.BAD_REQUEST);
        if (err.code === 'P2003') {
          throw new HttpException('Böyle bir ilan bulunmamaktadır!', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  private async fetchAds(...adIdArray: number[]): Promise<ProductDto[]> {
    let whereClause = {};
    if (adIdArray?.length > 0) {
      whereClause = { ...whereClause, id: { in: adIdArray } };
    }
    const products: ProductWithModelsAndCategories[] = await this.prisma.products.findMany({
      where: { ...whereClause },
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
        product_questions: true,
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
    const { product_images, seller_productsToseller, model, product_reviews, product_specs, ...rest } = product;
    let images = product_images?.map((image) => {
      return { url: image.url };
    });
    let complexProductItems = {
      imageUrl: product_images[0].url,
      modelName: model.name,
      brandName: model.brands.name,
      brandId: model.brands.id,
      categoryName: model.categories.name,
      categoryId: model?.categoryId,
      sellerId: seller_productsToseller?.id,
      sellerName: seller_productsToseller?.name,
      sellerLogo: seller_productsToseller?.marketplaceLogo,
      sellerMarketPlaceName: seller_productsToseller?.marketplaceName,
      parentId: model.categories.parrent,
      specs: product_specs,
      images,
    };
    return new ProductDto({ ...complexProductItems, ...rest });
  }
}
