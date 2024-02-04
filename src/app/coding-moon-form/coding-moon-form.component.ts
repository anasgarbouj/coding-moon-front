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
  selectedFileName: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}
// Modify the onFileSelect method
onFileSelect(event: Event): void {
  const eventTarget = event.target as HTMLInputElement;
  this.cv = null; // Reset the CV
  this.selectedFileName = ''; // Reset the file name
  this.errorMessage = ''; // Clear any previous error messages

  if (eventTarget.files && eventTarget.files[0]) {
    const file = eventTarget.files[0];

    // Check if the file size exceeds 200KB (200 * 1024 bytes)
    if (file.size > 200 * 1024) {
      this.errorMessage = 'The CV must be less than 200KB.';
      return;
    }

    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Please upload your CV as a PDF file.';
      return;
    }

    // If the file passes the size and type checks, proceed to set the file and file name
    this.cv = file;
    this.selectedFileName = file.name;
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
  
      if (this.cv) {
        try {
          const cvUploadResponse = await this.userService.uploadFile2(this.cv, this.email).toPromise();
          // Handle CV upload response if necessary
        } catch (error) {
          this.errorMessage = 'Failed to upload CV. Please try again.';
          console.error(error);
          return;
        }
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
  // In your CodingMoonFormComponent class

// Helper function to check if a string contains only alphabetic characters
isValidName(name: string): boolean {
  return /^[A-Za-z ]+$/.test(name);
}
// In your component's TypeScript code

// This method is used to trigger the hidden file input click event
triggerFileInput() {
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  fileInput.click();
}


}
