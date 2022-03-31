import {
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AskQuestionDto,
  QuestionResponseDto,
  ReviewResponseDto,
} from './dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async askQuestion(
    id: number,
    dto: AskQuestionDto,
  ) {
    await this.prisma.productQuestions.create({
      data: {
        userId: id,
        productId: dto.adId,
        userQuestion: dto.question,
        sellerAnswer: null,
        sellerAnswerDate: null,
        questionApproved: 0,
        answerApproved: 0,
      },
    });
  }

  getReviews(adId: number) {
    return this.getReviewsWithUser(adId);
  }

  getQuestions(adId: number) {
    return this.getQuestionsWithUser(adId);
  }

  private async getReviewsWithUser(
    adId: number,
  ): Promise<ReviewResponseDto[]> {
    const reviews =
      await this.prisma.productReviews.findMany({
        where: {
          productId: adId,
        },
        include: {
          users: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

    return reviews.map((review) => {
      return new ReviewResponseDto({
        id: review.id,
        content: review.reviewContent,
        star: review.reviewStars,
        firstName: review.users.firstName,
        lastName: review.users.lastName,
        reviewDate: review.reviewDate,
      });
    });
  }

  private async getQuestionsWithUser(
    adId: number,
  ): Promise<QuestionResponseDto[]> {
    const questions =
      await this.prisma.productQuestions.findMany(
        {
          where: {
            productId: adId,
          },
          include: {
            users: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      );
    return questions.map((question) => {
      return new QuestionResponseDto({
        id: question.id,
        question: question.userQuestion,
        answer: question.sellerAnswer,
        firstName: question.users.firstName,
        lastName: question.users.lastName,
        _questionDate: question.userQuestionDate,
        _answerDate: question.sellerAnswerDate,
      });
    });
  }
}
