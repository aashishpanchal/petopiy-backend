import { Brand, BrandModel } from '@/models';
import { inject, singleton } from 'tsyringe';
import { BadRequestError } from '@/lib/errors';
import { CreateBrandDto, UpdateBrandDto } from './brand.dtos';

@singleton()
export class BrandService {
  constructor(@inject(Brand.name) private brandModel: BrandModel) {}

  async create(createDto: CreateBrandDto) {
    // check if brand with slug exists
    const existingBrand = await this.brandModel.findOne({
      slug: createDto.slug,
    });

    if (existingBrand) {
      // throw error if brand exists
      throw new BadRequestError(
        `Brand with slug ${createDto.slug} already exists`,
      );
    }

    // create and save new brand
    const brand = new this.brandModel(createDto);
    return await brand.save();
  }

  async get(id: string) {
    // find brand by id
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      // throw error if brand not found
      throw new BadRequestError(`Brand with id ${id} not found`);
    }
    // return found brand
    return brand;
  }

  async update(id: string, updateDto: UpdateBrandDto) {
    // find and update brand by id
    const brand = await this.brandModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!brand) {
      // throw error if brand not found
      throw new BadRequestError(`Brand with id ${id} not found`);
    }
    // return updated brand
    return brand;
  }

  async delete(id: string) {
    // find and delete brand by id
    const brand = await this.brandModel.findByIdAndDelete(id);
    if (!brand) {
      // throw error if brand not found
      throw new BadRequestError(`Brand with id ${id} not found`);
    }
    // return deleted brand
    return brand;
  }
}
