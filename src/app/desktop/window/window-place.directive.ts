import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appWindowPlace]',
})
export class WindowPlaceDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
