import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { modelWithCategoriesAndBrands, ProductWithModelsAndCategories } from 'src/app.type-constants';
import { ProductDto } from '../cart/dto';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerQuestionDto, AnswersDto, PermissionDto, QuestionDto } from './dto';

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService) {}

  async getSellers(userId: number) {
    const sellerAccess = await this.prisma.userSellerAccess.findMany({
      where: {
        userId: 23,
      },
      select: {
        id: true,
        permissions: true,
        seller: true,
      },
    });
    if (!sellerAccess || sellerAccess.length === 0) {
      throw new HttpException('Böyle bir tedarikçi bulunmamaktadır!', HttpStatus.NOT_FOUND);
    }
    return sellerAccess;
  }

  async getAds(userId: number, dto: PermissionDto) {
    const { sellerId } = await this.getSellerAccessId(dto.permissionId);
    console.log(sellerId);
    return await this.fetchAds(sellerId);
  }

  private async fetchAds(seller: number): Promise<ProductDto[]> {
    const products: ProductWithModelsAndCategories[] = await this.prisma.products.findMany({
      where: {
        seller,
      },
      orderBy: [
        {
          id: 'asc',
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
    const { product_questions, product_images, seller_productsToseller, model, product_reviews, product_specs, ...rest } = product;
    let images = product_images?.map((image) => {
      return { url: image.url };
    });

    const answeredQuestions: QuestionDto[] = product_questions.map((item) => {
      if (item.sellerAnswer !== null) {
        return new QuestionDto(item);
      }
    });

    const nonAnsweredQuestions: QuestionDto[] = product_questions.map((item) => {
      if (item.sellerAnswer === null) {
        return new QuestionDto(item);
      }
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
      numOfAskedQuestions: product_questions.length,
      answeredQuestions,
      nonAnsweredQuestions,
      images,
    };
    return new ProductDto({ ...complexProductItems, ...rest });
  }

  private async getSellerAccessId(permissionId: number) {
    const access = await this.prisma.userSellerAccess.findUnique({
      where: {
        id: permissionId,
      },
      select: {
        sellerId: true,
      },
    });
    return access;
  }

  answerQuestion(dto: AnswersDto) {
    const { answers } = dto;
    answers.map(async (item) => {
      try {
        await this.prisma.productQuestions.update({
          data: {
            ...item,
            sellerAnswerDate: new Date(),
          },
          where: {
            id: item.id,
          },
        });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new BadRequestException('Cevaplanacak soru bulunamadı');
        }
      }
    });
  }

  updateSubMerchant(userId: number) {
    throw new Error('Method not implemented.');
  }

  createSubMerchant(userId: number) {
    throw new Error('Method not implemented.');
  }
}
