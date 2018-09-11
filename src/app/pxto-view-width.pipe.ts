import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'px2vw'
})
export class PXtoViewWidthPipe implements PipeTransform {

  transform(value: number): number {
    return value * (100 / document.documentElement.clientWidth);
  }

}
