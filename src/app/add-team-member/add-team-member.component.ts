import { Component, OnInit } from '@angular/core';
import { IUser } from '../user';
import { UserService } from '../user-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.css']
})
export class AddTeamMemberComponent implements OnInit {
  newMember: IUser = {
    firstname: '',
    lastname: '',
    email: '',
    birth_date: '',
    university: '',
    phone: '',
    password: ''
  };
  errorMessage: string = ''; // Property to store error message

  constructor(private userService: UserService , private router:Router) { }

  ngOnInit(): void {
  }
  TeamName: string = '';
  showTeamMemberForm: boolean = false;
  memberName: string = ''; // Array to store team members' names
 
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  university: string='';
  birth_date: string=''; // Add this line for Date of Birth

  cv:string='';
  
  cvFile: File | null = null;
  showTeamMemberForm2: boolean = false;
  toggleButtonText: string = '+ Add Team Member';

 
  toggleTeamMemberForm() {
    this.showTeamMemberForm = !this.showTeamMemberForm;
    this.toggleButtonText = this.showTeamMemberForm ? '- Add Team Member' : '+ Add Team Member';
    
  }
  
  
  onFileSelect(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      const file = eventTarget.files[0];
  
      // Check if the file is a PDF
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Please upload your CV as a PDF file.';
        return; // Exit the function if file is not a PDF
      }
  
      // Check if the file size is less than or equal to 200 KB
      if (file.size > 200 * 1024) {
        this.errorMessage = 'The file size should not exceed 200 KB.';
        return; // Exit the function if file exceeds size limit
      }
  
      this.cvFile = file; // If checks pass, assign the file to cvFile
      this.errorMessage = ''; // Clear any previous error messages
    }
  }
  
 async addTeamMember() {
    if (this.cvFile) {
      try {
        await this.userService.uploadFile(this.cvFile).toPromise();
        // File uploaded successfully, now add team member
        this.addMember();
      } catch (error) {
        console.error('Error uploading CV:', error);
        this.errorMessage = 'Failed to upload CV. Please try again.';
      }
    } else {
      // If no CV, directly add team member
      this.addMember();
    }
  }
  
  private addMember() {
    if (this.newMember.firstname && this.newMember.lastname) {
      this.userService.addUserToTeam(this.newMember).subscribe(
        response => {
          // Handle the successful addition of the team member
          this.resetNewMemberForm();
          this.router.navigate(['/create-team']);
        },
        error => {
          console.error('Error adding team member:', error);
          this.errorMessage = error.error.message || 'Error adding team member';
        }
      );
    }
  }
  resetNewMemberForm() {
    this.newMember = {
      firstname: '',
      lastname: '',
      email: '',
      birth_date: '',
      university: '',
      phone: '',
      password: ''
    };
    this.showTeamMemberForm = false; // Hide the form
  }
  confirmTeam() {
    this.router.navigate(['/**']);
  }

 
}
