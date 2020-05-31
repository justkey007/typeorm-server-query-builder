import { Like, MoreThan, MoreThanOrEqual } from 'typeorm';
import { ITEMS_PER_PAGE } from '../../src/default-config';
import { QueryBuilder } from '../../src/query-builder';

describe('Test Query Builder #build', () => {
  it('should build a query with an exact & contains filter', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      join: 'posts,comments',
      select: 'name,phoneNumber'
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      relations: ['posts', 'comments'],
      select: ['name', 'phoneNumber'],
      skip: 0,
      take: ITEMS_PER_PAGE
    });
  });

  it('should build a query with skip equals to 0 and take equals to ITEMS_PER_PAGE', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      page: 1
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      skip: 0,
      take: ITEMS_PER_PAGE
    });
  });

  it('should build a query with skip equals to ITEMS_PER_PAGE and take equals to ITEMS_PER_PAGE', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      page: 2
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      skip: ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE
    });
  });

  it('should build a query with skip equals to 50 and take equals to ITEMS_PER_PAGE', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      page: 3
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      skip: 50,
      take: ITEMS_PER_PAGE
    });
  });

  it('should build a query with skip equals to 20 and take equals to 10', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      page: 3,
      limit: 10
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      skip: 20,
      take: 10
    });
  });

  it('should build a query with no paginated results when pagination equals to false', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      pagination: false
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      }
    });
  });

  it('should build a query with paginated results when pagination equals to true', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com',
      pagination: true
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      skip: 0,
      take: ITEMS_PER_PAGE
    });
  });

  it('should build a query with paginated results when pagination equals undefined', () => {
    const queryBuilder = new QueryBuilder({
      name: 'rjlopezdev',
      email__contains: '@gmail.com'
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: {
        name: 'rjlopezdev',
        email: Like('%@gmail.com%')
      },
      skip: 0,
      take: ITEMS_PER_PAGE
    });
  });
});

describe('Test QueryBuilder #setPage', () => {
  it('should return a skip equals to 0 when page property is not provided', () => {
    const queryBuilder: any = new QueryBuilder({});
    queryBuilder.setPage();
    expect(queryBuilder.typeORMQuery).toEqual({
      skip: 0
    });
  });

  it('should return a skip equals to 0 when page equals to 1', () => {
    const queryBuilder: any = new QueryBuilder({
      page: 1
    });
    queryBuilder.setPage();
    expect(queryBuilder.typeORMQuery).toEqual({
      skip: 0
    });
  });

  it('should return a skip equals to ITEMS_PER_PAGE when page equals to 2', () => {
    const queryBuilder: any = new QueryBuilder({
      page: 2
    });
    queryBuilder.setPage();
    expect(queryBuilder.typeORMQuery).toEqual({
      skip: ITEMS_PER_PAGE
    });
  });
});

describe('Test QueryBuilder #setLimit', () => {
  it('should return a take equals to ITEMS_PER_PAGE when limit is not provided', () => {
    const queryBuilder: any = new QueryBuilder({});
    queryBuilder.setLimit();
    expect(queryBuilder.typeORMQuery).toEqual({
      take: ITEMS_PER_PAGE
    });
  });

  it('should return a take equals to ITEMS_PER_PAGE when limit equals to 0', () => {
    const queryBuilder: any = new QueryBuilder({
      limit: 0
    });
    queryBuilder.setLimit();
    expect(queryBuilder.typeORMQuery).toEqual({
      take: ITEMS_PER_PAGE
    });
  });

  it('should return a take equals to 1 when limit equals to 1', () => {
    const queryBuilder: any = new QueryBuilder({
      limit: 1
    });
    queryBuilder.setLimit();
    expect(queryBuilder.typeORMQuery).toEqual({
      take: 1
    });
  });
});

describe('Test QueryBuilder #setOrder', () => {
  it('should return a query with no order property', () => {
    const queryBuilder: any = new QueryBuilder({});
    queryBuilder.setOrder();
    expect(queryBuilder.typeORMQuery).toEqual({});
  });

  it('should return a query with order equals to foo:ASC', () => {
    const queryBuilder: any = new QueryBuilder({
      order: '+foo'
    });
    queryBuilder.setOrder();
    expect(queryBuilder.typeORMQuery).toEqual({
      order: {
        foo: 'ASC'
      }
    });
  });

  it('should return a query with order equals to foo:DESC', () => {
    const queryBuilder: any = new QueryBuilder({
      order: '-foo'
    });
    queryBuilder.setOrder();
    expect(queryBuilder.typeORMQuery).toEqual({
      order: {
        foo: 'DESC'
      }
    });
  });

  it('should thrown an error when order criteria is not provided', () => {
    const queryBuilder: any = new QueryBuilder({
      order: 'foo'
    });
    expect(() => queryBuilder.setOrder()).toThrow();
  });
});

describe('Test QueryBuilder #getOrderCriteria', () => {
  it('should return a query with order equals to foo:ASC', () => {
    const queryBuilder: any = new QueryBuilder({});
    const orderCriteria = queryBuilder.getOrderCriteria('+foo');
    expect(orderCriteria).toBe('ASC');
  });

  it('should return a query with order equals to foo:DESC', () => {
    const queryBuilder: any = new QueryBuilder({});
    const orderCriteria = queryBuilder.getOrderCriteria('-foo');
    expect(orderCriteria).toBe('DESC');
  });

  it('should thrown an error when order criteria is not provided', () => {
    const queryBuilder: any = new QueryBuilder({});
    expect(() => {
      queryBuilder.getOrderCriteria('foo');
    }).toThrow();
  });

  it('should build simple OR type condition', () => {
    const queryBuilder = new QueryBuilder({
      $or: 'name:juste|age__gte:15',
      pagination: false
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: [{ name: 'juste', age: MoreThanOrEqual('15') }]
    });
  });

  it('should build several OR type condition unions', () => {
    const queryBuilder = new QueryBuilder({
      $or: ['name:juste|age__gte:15', 'user.role:admin'],
      pagination: false
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: [
        { name: 'juste', age: MoreThanOrEqual('15') },
        { user: { role: 'admin' } }
      ]
    });
  });

  it('should build several union of condition of type OR combined with a basic condition AND', () => {
    const queryBuilder = new QueryBuilder({
      $or: ['name:juste|age__gte:15', 'user.role:admin'],
      city: 'Dahomey',
      pagination: false
    });
    const build = queryBuilder.build();
    expect(build).toEqual({
      where: [
        { name: 'juste', city: 'Dahomey', age: MoreThanOrEqual('15') },
        { user: { role: 'admin' }, city: 'Dahomey' }
      ]
    });
  });

  it('Should delete the field before building it', () => {
    const queryBuilder = new QueryBuilder({
      name: 'Bossa',
      name__isnull: true,
      $or: ['name__endswith:ey|size__gt:18'],
      pagination: false
    });
    queryBuilder.removeField('name');
    expect(queryBuilder.build()).toEqual({
      where: [{ size: MoreThan('18') }]
    });
  });
});
