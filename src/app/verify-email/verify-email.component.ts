import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service.service'; // Adjust the import path as needed

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  verificationCode: string = '';
  errorMessage: string = '';
  isVerified: boolean = false;
email:string='';
  constructor(private userService: UserService, private router: Router) {}

  verifyCode() {
    if (this.verificationCode.trim() === '') {
      this.errorMessage = 'Please enter the verification code.';
      return;
    }
  
    console.log('Verifying code:', this.verificationCode); // Log the code being verified
    this.userService.verifyEmailCode(this.verificationCode, this.email).subscribe({
      next: (response) => {
        // Handle successful verification
        this.isVerified = true;
        // Navigate to a success page or show a success message
        this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        console.log('Verification code:', this.verificationCode);
        console.error('Verification failed:', error); // Log more detailed error
        this.errorMessage = 'Verification failed. Please try again.';
      }
    });
  }
  
}
