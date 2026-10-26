import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice } from '../utils/format';

@Pipe({ name: 'precio' })
export class PrecioPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatPrice(value);
  }
}
