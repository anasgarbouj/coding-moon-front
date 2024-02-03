import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  timeLeft: number = 600; // 10 minutes in seconds
  private timeoutId: any;

  constructor(
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  token: string = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    // Start the countdown
    this.timeoutId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        console.log("Time's up. Redirecting to sign-in.");
        this.router.navigate(['/sign-in']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timeoutId); // Clear the interval on destroy
  }

  onResetPassword(): void {
    this.passwordError = '';

    if (this.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    if (this.newPassword === this.confirmPassword) {
      this.userService.resetPassword(this.newPassword, this.confirmPassword, this.token).subscribe({
        next: (response) => {
          console.log('Password has been reset successfully');
          clearInterval(this.timeoutId); // Clear the timeout on successful password reset
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Reset password error:', error);
        }
      });
    } else {
      this.passwordError = 'Passwords do not match';
    }
  }
}
