import { Injectable } from '@nestjs/common';
import { categories } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  getCategories(): Promise<categories[]> {
    return this.prisma.categories.findMany();
  }

  getCategory(id: number): Promise<categories> {
    return this.prisma.categories.findUnique({
      where: {
        id,
      },
    });
  }
}
