import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contentViewChildType',
  standalone: true,
})
export class ContentViewChildTypePipe implements PipeTransform {
  transform<T>(value: T): NonNullable<T> | null {
    return value ?? null;
  }
}
