import { Request } from 'express';
import { singleton } from 'tsyringe';
import { ApiRes } from '@/lib/response';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './brand.dtos';

@singleton()
export class BrandController {
  constructor(private brandService: BrandService) {}

  async create(req: Request<any, any, CreateBrandDto>) {
    // get body from request
    const body = req.body;
    // create a new brand
    const data = await this.brandService.create(body);
    // return created brand information
    return ApiRes.created(data, 'Brand created successfully.');
  }

  async get(req: Request<{ id: string }>) {
    const { id } = req.params;
    // get brand by id
    const data = await this.brandService.get(id);
    // return fetched brand information
    return ApiRes.ok(data, 'Brand fetched successfully.');
  }

  async update(req: Request<{ id: string }, any, UpdateBrandDto>) {
    const { id } = req.params;
    const body = req.body;
    // update brand by id
    const data = await this.brandService.update(id, body);
    // return updated brand information
    return ApiRes.ok(data, 'Brand updated successfully.');
  }

  async delete(req: Request<{ id: string }>) {
    const { id } = req.params;
    // delete brand by id
    const data = await this.brandService.delete(id);
    // return delete confirmation
    return ApiRes.ok(data, 'Brand deleted successfully.');
  }
}
