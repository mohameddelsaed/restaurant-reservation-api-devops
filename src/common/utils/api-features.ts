import {
  FindManyOptions,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { excludeFields } from './exclude-fields';

export class APIFeatures<T> {
  private options: FindManyOptions<T> = {};

  constructor(private queryString: Record<string, any>) {}

  filter() {
    const regex = /(in|ne|gt|gte|lt|lte)/i;

    const filterObj: Record<string, any> = {};
    excludeFields(['page', 'sort', 'limit', 'fields'], this.queryString);

    for (const [key, value] of Object.entries(this.queryString)) {
      if (regex.test(key)) {
        const [name, operator] = key.split('[');
        switch (operator.slice(0, -1)) {
          case 'gt':
            filterObj[name] = MoreThan(+value);
            break;
          case 'gte':
            filterObj[name] = MoreThanOrEqual(+value);
            break;
          case 'lt':
            filterObj[name] = LessThan(+value);
            break;
          case 'lte':
            filterObj[name] = LessThanOrEqual(+value);
            break;
          case 'in':
            const inArray =
              typeof value === 'string' ? value.split(',') : value;
            filterObj[name] = In(inArray);
            break;
          case 'ne':
            filterObj[name] = Not(value);
            break;
        }
      } else {
        filterObj[key] = value;
      }
    }

    this.options.where = filterObj as any;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let order: Record<string, 'asc' | 'desc'> = {};
      const fields = this.queryString.sort.split(',');

      fields.forEach((field: string) => {
        if (field.startsWith('-')) {
          order[field.slice(1)] = 'desc';
        } else {
          order[field] = 'asc';
        }
      });
      this.options.order = order as any;
    } else {
      this.options.order = {
        created_at: 'desc',
      } as any;
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const select: Record<string, true> = {};
      const fields = this.queryString.fields.split(',');

      fields.forEach((field: string) => {
        select[field] = true;
      });

      this.options.select = select as any;
    }

    return this;
  }

  paginate() {
    const page = this.queryString?.page ?? 1;
    const limit = this.queryString?.limit ?? 10;
    const skip = (page - 1) * limit;

    this.options.skip = skip;
    this.options.take = limit;

    return this;
  }

  getOptions(): FindManyOptions<T> {
    return this.options;
  }
}
