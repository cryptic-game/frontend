import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'px2vh',
})
export class PXtoViewHeightPipe implements PipeTransform {
  transform(value: number): number {
    return value * (100 / document.documentElement.clientHeight);
  }
}
