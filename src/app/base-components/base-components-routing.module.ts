import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponentsComponent } from './base-components.component';

const routes: Routes = [{ path: '', component: BaseComponentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseComponentsRoutingModule { }
