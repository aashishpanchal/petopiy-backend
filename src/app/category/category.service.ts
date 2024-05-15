import { inject, singleton } from 'tsyringe';
import { BadRequestError } from '@/lib/errors';
import { Category, CategoryModel } from '@/models';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dtos';

@singleton()
export class CategoryService {
  constructor(@inject(Category.name) private categoryModel: CategoryModel) {}

  async create({ child, ...createDto }: CreateCategoryDto) {
    // Check if a category with the given slug already exists
    const existingCategory = await this.categoryModel.findOne({
      slug: createDto.slug,
    });
    if (existingCategory) {
      // Throw error if category with slug exists
      throw new BadRequestError('Category with slug already exists');
    }
    // Create and save new category
    const category = new this.categoryModel({ child, ...createDto });
    return await category.save();
  }

  async get(id: string) {
    // Find category by ID
    const category = await this.categoryModel.findById(id);
    if (!category) {
      // Throw error if category not found
      throw new BadRequestError(`Category with id ${id} not found`);
    }
    // Return found category
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto) {
    // Find and update category by ID
    const category = await this.categoryModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!category) {
      // Throw error if category not found
      throw new BadRequestError(`Category with id ${id} not found`);
    }
    // Return updated category
    return category;
  }

  async delete(id: string) {
    // Find and delete category by ID
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      // Throw error if category not found
      throw new BadRequestError(`Category with id ${id} not found`);
    }
    // Return deleted category
    return category;
  }
}
