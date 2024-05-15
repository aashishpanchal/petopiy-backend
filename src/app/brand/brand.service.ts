import { Brand, BrandModel } from '@/models';
import { inject, singleton } from 'tsyringe';

@singleton()
export class BrandService {
  constructor(@inject(Brand.name) private brandModel: BrandModel) {}
}
