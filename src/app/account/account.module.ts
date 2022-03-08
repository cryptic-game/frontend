import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {AccountPageBaseComponent} from "./account-page-base/account-page-base.component";
import {AccountRoutingModule} from "./account-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgParticlesModule} from "ng-particles";

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    AccountPageBaseComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    NgParticlesModule
  ]
})
export class AccountModule {
}
