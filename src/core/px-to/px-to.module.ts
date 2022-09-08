import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PXtoViewWidthPipe } from './pxto-view-width.pipe';
import { PXtoViewHeightPipe } from './pxto-view-height.pipe';

@NgModule({
  declarations: [PXtoViewWidthPipe, PXtoViewHeightPipe],
  exports: [PXtoViewWidthPipe, PXtoViewHeightPipe],
  imports: [CommonModule],
})
export class PxToModule {}
