import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service.service'; // Import your UserService

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  teamName: string = '';
  password: string = '';
  errorMessage: string = ''; // To display error messages

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  onSignIn() {
    if (this.teamName && this.password) {
      // Call the signin method from your UserService
      this.userService.signin(this.teamName, this.password).subscribe(
        (response) => {
          // Handle successful response (e.g., store JWT token and navigate)
          localStorage.setItem('jwtToken', response.token);
          this.router.navigate(['/landing-page']);
        },
        (error) => {
          // Handle error response (display error message)
          this.errorMessage =
            error.error.message || 'An error occurred during sign in. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please enter team name and password.';
    }
  }
}
