import { container } from 'tsyringe';
import { getModelForClass } from '@typegoose/typegoose';

// model factory function is used to register models with tsyringe
export const modelFactory = <T>(
  token: string,
  clsModel: new (...args: any[]) => T,
) => {
  // get model
  const model = getModelForClass(clsModel);
  // register model with tsyringe
  container.register(token, {
    useValue: model,
  });
};
