import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service.service'; // Make sure the path is correct

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  errorMessage: string = ''; // To hold error messages

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  onResetPassword() {
    if (this.email) {
      // Call the forgotPassword service method
      this.userService.forgotPassword(this.email).subscribe(
        response => {
          console.log('Password reset email sent to:', this.email);
          // Navigate to a confirmation page or show a success message
          this.router.navigate(['/password-reset-confirmation']);
        },
        error => {
          // Handle the error case
          console.error('Error during password reset:', error);
          this.errorMessage = error.error.message || 'An error occurred while sending the reset link.';
        }
      );
    } else {
      // Set error message for empty email field
      this.errorMessage = 'Please enter your email address.';
    }
  }
}
