import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service.service'; // Update the path accordingly
import { IUser } from '../user'; // Import the User model

@Component({
  selector: 'app-coding-moon-form',
  templateUrl: './coding-moon-form.component.html',
  styleUrls: ['./coding-moon-form.component.css']
})
export class CodingMoonFormComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  university: string = '';
  teamPassword: string = '';
  cteamPassword: string = '';
  dateOfBirth: string = '';
  cv: File | null = null; // Change to File type
  errorMessage: string = '';
  formSubmitted: boolean = false; // Track if the form has been submitted

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}
  onFileSelect(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      this.cv= eventTarget.files[0];
    }
  }
  async onSubmit() {
    this.formSubmitted = true; // Set form as submitted

    // Validate email
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Validate password (at least 6 characters)
    if (this.teamPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    // Validate phone number (numeric characters only)
    if (!this.isNumeric(this.phoneNumber)) {
      this.errorMessage = 'Please enter a valid phone number.';
      return;
    }

    if (this.teamPassword !== this.cteamPassword) {
      // Handle password mismatch
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    try {
      // Register the user first
      const newUser: IUser = {
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        phone: this.phoneNumber,
        university: this.university,
        password: this.teamPassword,
        birth_date: this.dateOfBirth
        // Add other necessary fields
      };
  
      const registerResponse = await this.userService.signup(newUser).toPromise();
      // Assuming the backend returns some identifier or success message on registering the user
  
      // If registration is successful and a CV is present, upload the CV
      if (this.cv) {
        const cvUploadResponse = await this.userService.uploadFile2(this.cv,newUser.email).toPromise();
        // Handle CV upload response if necessary
      }else {
        // Handle the case where CV is not selected
        console.error("No file selected for upload.");
        return;
      }
  
      // Navigate to verify-email or handle successful registration as needed
      this.router.navigate(['/verify-email']);
    } catch (error) {
      // Handle registration or CV upload error
      this.errorMessage = 'Failed to register user or upload CV. Please try again.';
      console.error(error);
    }
  }
  

  // Helper function to validate email format
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Helper function to check if a string contains only numeric characters
  isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }
}
