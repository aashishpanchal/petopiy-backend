import { singleton } from 'tsyringe';
import { BrandService } from './brand.service';

@singleton()
export class BrandController {
  constructor(private brandService: BrandService) {}
}
