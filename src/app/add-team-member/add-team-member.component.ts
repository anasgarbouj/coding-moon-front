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

  
  onFileSelect(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      this.cvFile = eventTarget.files[0];
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

  toggleTeamMemberForm() {
    this.showTeamMemberForm = !this.showTeamMemberForm;
  }
}
