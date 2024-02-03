import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-confirmation',
  templateUrl: './password-reset-confirmation.component.html',
  styleUrls: ['./password-reset-confirmation.component.css']
})
export class PasswordResetConfirmationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']); // Replace '/sign-in' with your actual sign-in route
  }
}
