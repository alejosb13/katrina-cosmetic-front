import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutes } from './auth.routing';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
  ],
  declarations: [
    LoginComponent,
  ]
})
export class AuthModule { }
