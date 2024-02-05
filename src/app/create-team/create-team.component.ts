import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service.service'; // Import your UserService
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { TeamMember } from '../team-member'; // Import TeamMember model

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  TeamName: string = '';
  showTeamMemberForm: boolean = false;
  teamMembers: TeamMember[] = []; // Array to store team members' details
  memberName: string = ''; // Array to store team members' names
  currentUserId: number = 0;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  university: string='';
  dateOfBirth: string=''; // Add this line for Date of Birth
  confirmTeamErrorMessage: string = '';

  isTeamNameDisabled: boolean = false; // Flag to control the input's disabled state
  teamId: string = ''; // Add a property to store the team ID

  teamLogoFile: File | null = null; // Property to store the selected file

 
  
  constructor(private router:Router , private userService: UserService , private dialog: MatDialog ,     private sanitizer: DomSanitizer // Inject DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fetchTeamLogo();

    this.userService.getTeam().subscribe(
      response => {
        if (response && response.name) {
          this.isTeamNameDisabled = true; 
          this.teamId = response.id; // Assume the response contains an 'id' field
          if (response && response.squad_members) {
            this.fetchTeamMembers(response.squad_members);
          }
          this.TeamName = response.name;
        }
        // If no team, the user can create a new one, TeamName remains an empty string
      },
      error => {
        // Handle error scenario, maybe set an error message to display
      }
    );
    this.userService.getUser().subscribe(
      currentUser => {
        this.currentUserId = currentUser.id;
        // ... Fetch team details ...
      });
  }
  fetchTeamMembers(memberIds: number[]): void {
    memberIds.forEach(id => {
      this.userService.getUserById(id).subscribe(
        userResponse => {
          const member: TeamMember = {
            id: userResponse.id,
            firstName: userResponse.firstname, // Match the response key
            lastName: userResponse.lastname,   // Match the response key
            // ... other properties ...
          };
          this.teamMembers.push(member);
        },
        error => {
          // ... Error handling ...
        }
      );
    });
  }
  
// Property to store the error message for the logo file
logoErrorMessage: string = '';

onFileSelect(event: Event): void {
  const eventTarget = event.target as HTMLInputElement;
  if (eventTarget.files && eventTarget.files[0]) {
    const file = eventTarget.files[0];
    const validFileTypes = [ 'image/jpg', 'image/jpeg'];

    // Check if the file is an image and of PNG, JPG or JPEG type
    if (!validFileTypes.includes(file.type)) {
      this.logoErrorMessage = 'Please upload your logo as a JPEG or JPG file.';
      this.teamLogoFile = null; // Reset the file
      // Optionally, clear the preview image
      const teamLogoPreview = document.getElementById('teamLogoPreview') as HTMLImageElement;
      if (teamLogoPreview) {
        teamLogoPreview.src = '';
        teamLogoPreview.style.display = 'none';
      }
    } else {
      this.logoErrorMessage = ''; // Clear any previous error message
      this.teamLogoFile = file;
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const teamLogoPreview = document.getElementById('teamLogoPreview') as HTMLImageElement;
        if (teamLogoPreview) {
          teamLogoPreview.src = e.target.result;
          teamLogoPreview.style.display = 'block'; // Show the preview
        }
      };
      reader.readAsDataURL(this.teamLogoFile);
    }
  }
}

 

  removeTeamMember(member: TeamMember) {
    if (member.id === this.currentUserId) {
      // Display error message - cannot delete oneself
      alert('You cannot delete yourself from the team.');
      return;
    }

    this.userService.deleteUser(member.id).subscribe(
      response => {
        this.teamMembers = this.teamMembers.filter(m => m.id !== member.id);
        // Handle post-deletion logic
      },
      error => {
      }
    );
  }



  confirmTeam() {
    if (this.TeamName) {
      this.userService.createTeam({ name: this.TeamName }).subscribe(
        response => {
          // Assuming the response includes the team ID or some identifier
          if (this.teamLogoFile) {
            // If a team logo file has been selected, prepare it for upload
            const formData = new FormData();
            formData.append('file', this.teamLogoFile); // Ensure 'file' matches the server's expected key
  
            // Now, call the uploadImage method with formData
            this.userService.uploadImage(formData).subscribe(
              logoUploadResponse => {
                // Handle successful logo upload
                this.openSuccessDialog();
                this.router.navigate(['/landing-page']);
              },
              logoUploadError => {
                // Handle logo upload error
                // You can decide how to handle this, e.g., show an error message
              }
            );
          } else {
            // No logo file was selected, proceed without logo upload
            this.openSuccessDialog();
            this.router.navigate(['/landing-page']);
          }
        },
        error => {
          this.handleTeamCreationError(error);
        }
      );
    } else {
      this.confirmTeamErrorMessage = 'Please enter a team name.';
    }
  }
  
  updateTeamDetails(): void {
    if (this.TeamName && this.teamId) {
      this.userService.updateTeam(   this.TeamName ).subscribe(
        response => {
          // Handle the successful update, maybe show a success message
          this.openSuccessDialog();

        },
        error => {
          // Handle the error scenario
        }
      );
    } else {
      // Handle the case where team name is empty or team ID is not available
    }
  }
  teamLogoUrl: string = ''; // Property to hold the logo URL
  teamLogoUrlSafe: SafeUrl = null as unknown as SafeUrl; // Initialize with null

  fetchTeamLogo(): void {
    this.userService.getTeamLogo().subscribe(
      response => {
        const logoUrl = response.message;
        if (logoUrl) {
          this.teamLogoUrl = logoUrl;

// For debugging purposes only
this.teamLogoUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(logoUrl);
        } else {
        }
      },
      error => {
      }
    );
  }
  
  


  updateTeamLogo(): void {
    if (this.teamLogoFile) {
      const formData = new FormData();
      formData.append('file', this.teamLogoFile);
      // Assuming teamId is necessary to identify which team's logo to update
      this.userService.updateTeamLogo(formData).subscribe(
        response => {
          // Handle successful logo update
          this.openSuccessDialog();
        },
        error => {
          // Handle error scenario
        }
      );
    } else {
    }
  }
  confirmTeamOrSaveChanges(): void {
    if (this.isTeamNameDisabled) {
      // Update existing team
      this.updateTeamDetails();
      if (this.teamLogoFile) {
        this.updateTeamLogo();
      }
    } else {
      // Confirm and create a new team
      this.confirmTeam();
    }
  }
  

  private handleTeamCreationError(error: any): void {
    if (error.status === 400) {
      this.confirmTeamErrorMessage = 'Team already exists.';
    } else {
      this.confirmTeamErrorMessage = 'An error occurred while creating the team.';
    }
  }
  openSuccessDialog() {
    this.dialog.open(SuccessDialogComponent, {
      width: '250px'
    });
  
}

 
addmember() {
  if (this.teamMembers.length >= 5) {
    this.confirmTeamErrorMessage = 'Cannot add more than 5 team members.';
    // Optionally, prevent navigation or further action here
    return; // Exit the method to prevent adding more members
  }
  // Check if team already exists
  if (this.isTeamNameDisabled) {
    // Navigate to add-member page without creating a new team
    this.router.navigate(['/add-member']);
  } else {
    // If team doesn't exist, create it
    if (this.TeamName) {
      this.userService.createTeam({ name: this.TeamName }).subscribe(
        response => {
          // Assuming the response includes the team ID or some identifier
          if (this.teamLogoFile) {
            // If a team logo file has been selected, prepare it for upload
            const formData = new FormData();
            formData.append('file', this.teamLogoFile); // Ensure 'file' matches the server's expected key
  
            // Now, call the uploadImage method with formData
            this.userService.uploadImage(formData).subscribe(
              logoUploadResponse => {
                // Handle successful logo upload
               
                this.router.navigate(['/add-member']);
              },
              logoUploadError => {
                // Handle logo upload error
                // You can decide how to handle this, e.g., show an error message
              }
            );
          } else {
            // No logo file was selected, proceed without logo upload
            this.openSuccessDialog();
            this.router.navigate(['/add-member']);
          }
        },
        error => {
          this.handleTeamCreationError(error);
        }
      );
    } else {
      this.confirmTeamErrorMessage = 'Please enter a team name.';
    }
  }}

  deleteSquad(): void {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });

    // Handle the dialog result
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Proceed with deletion if the user confirmed
        this.userService.deleteTeam().subscribe(
          response => {
            this.router.navigate(['/**']);
            // For example, you might navigate away or show a success message
            // ... additional success handling ...
          },
          error => {
            // Handle the error scenario, such as displaying an error message
          }
        );
      } else {
        // Deletion cancelled, handle accordingly
        // ... additional handling for cancellation ...
      }
    });
  }
  


  

}
