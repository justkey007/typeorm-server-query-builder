import { FilterFactory } from "../../src/filter-factory";
import { FieldFilter } from "../../src/field-filter";

describe('Test FilterFactory #get', () => {

  const factory = new FilterFactory();

  it('should return an instance of FieldFilter', () => {
    const filter = factory.get({}, 'field', 'value');
    expect(filter).toBeInstanceOf(FieldFilter);
  });

  it('should return an instance of FieldFilter with notOperator equals to true', () => {
    const filter = factory.get({}, 'field__not', 'value') as any;
    expect(filter).toBeInstanceOf(FieldFilter);
    expect(filter.notOperator).toBeTruthy();
  });

  it('should return an instance of FieldFilter with notOperator equals to false', () => {
    const filter = factory.get({}, 'field', 'value') as any;
    expect(filter).toBeInstanceOf(FieldFilter);
    expect(filter.notOperator).toBeFalsy();
  });
})


describe('Test FilterFactory #isFieldFilter', () => {

  const factory: any = new FilterFactory();

  it('should return true', () => {
    const isField = factory.isFieldFilter('field');
    expect(isField).toBeTruthy();
  });

  it('should return false', () => {
    const isField = factory.isFieldFilter('fk.field');
    expect(isField).toBeFalsy();
  });

});
