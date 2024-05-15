import { Request } from 'express';
import { singleton } from 'tsyringe';
import { ApiRes } from '@/lib/response';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dtos';

@singleton()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // Create a new category
  async create(req: Request<any, any, CreateCategoryDto>) {
    // get body from request
    const body = req.body;
    // create a new category
    const data = await this.categoryService.create(body);
    // return created category information
    return ApiRes.created(data, 'Category created successfully.');
  }

  // Get a category by ID
  async get(req: Request<{ id: string }>) {
    // get id from request params
    const { id } = req.params;
    // get category by id
    const data = await this.categoryService.get(id);
    // return fetched category information
    return ApiRes.ok(data, 'Category fetched successfully.');
  }

  // Update a category by ID
  async update(req: Request<{ id: string }, any, UpdateCategoryDto>) {
    // get id from request params
    const { id } = req.params;
    // get body from request
    const body = req.body;
    // update category by id
    const data = await this.categoryService.update(id, body);
    // return updated category information
    return ApiRes.ok(data, 'Category updated successfully.');
  }

  // Delete a category by ID
  async delete(req: Request<{ id: string }>) {
    // get id from request params
    const { id } = req.params;
    // delete category by id
    const data = await this.categoryService.delete(id);
    // return delete confirmation
    return ApiRes.ok(data, 'Category deleted successfully.');
  }
}
