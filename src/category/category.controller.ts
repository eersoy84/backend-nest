import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UserDto } from 'src/auth/dto';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/guard';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get('/:id')
  getCategory(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.getCategory(id);
  }
}
