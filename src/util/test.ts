import R from "ramda";
import joi, { assert } from "@hapi/joi";

type FactorySchema = {
  [key: string]: () => object;
};

type Initializer = () => object;

export class Factory {
  private models: FactorySchema;

  constructor() {
    this.models = {};
  }

  public define(name: string, initializer: Initializer): void {
    assert(name, joi.string().required(), "Error name is not defined");
    assert(initializer, joi.function().required(), "Error in passed the initializer");
    assert(initializer(), joi.object().required(), "Error on definition schema");

    this.models[name] = initializer;
  }

  public create<T>(name: string, assign: T | object = {}): T {
    assert(name, joi.string().required(), "Error name not passed by param to create");
    assert(this.models[name], joi.func().required(), `Error model not defined with "${name}"`);

    return this.deepMerge<T>(this.models[name]() || {}, assign);
  }

  private deepMerge<T>(a: object, b: T | object): T {
    return (R.is(Object, a) && R.is(Object, b)) ? R.mergeWith(this.deepMerge.bind(this), a, b) : b;
  }
}
