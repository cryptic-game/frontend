import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {NgModule} from "@angular/core";
import {AccountGuard} from "./account.guard";
import {SignUpComponent} from "./sign-up/sign-up.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AccountGuard]},
  {path: 'signup', component: SignUpComponent, canActivate: [AccountGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
