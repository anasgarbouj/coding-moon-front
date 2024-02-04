import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CodingMoonFormComponent } from './coding-moon-form/coding-moon-form.component';
import { FormsModule } from '@angular/forms';
import { CreateTeamComponent } from './create-team/create-team.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetConfirmationComponent } from './password-reset-confirmation/password-reset-confirmation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading-interceptor.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthInterceptor } from './auth.interceptor';
import { LeaderDialogComponent } from './leader-dialog/leader-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    CodingMoonFormComponent,
    CreateTeamComponent,
    SignInComponent,
    ForgotPasswordComponent,
    PasswordResetConfirmationComponent,
    ResetPasswordComponent,
    LandingPageComponent,
    AddTeamMemberComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    SuccessDialogComponent,
    VerifyEmailComponent,
    LeaderDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
