import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTeamComponent } from './create-team/create-team.component';  
import { CodingMoonFormComponent } from './coding-moon-form/coding-moon-form.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetConfirmationComponent } from './password-reset-confirmation/password-reset-confirmation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import { AuthGuard } from './auth.guard';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'coding-moon-form', component: CodingMoonFormComponent },
  { path: 'create-team', component: CreateTeamComponent, canActivate: [AuthGuard] },
  { path: 'add-member', component: AddTeamMemberComponent, canActivate: [AuthGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'password-reset-confirmation', component: PasswordResetConfirmationComponent },
  { path: 'resetpassword/:token', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {path : 'verify-email' , component:VerifyEmailComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
