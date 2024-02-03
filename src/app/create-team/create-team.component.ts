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
          console.log(response);// Disable input if team exists
          this.teamId = response.id; // Assume the response contains an 'id' field
          if (response && response.squad_members) {
            this.fetchTeamMembers(response.squad_members);
          }
          this.TeamName = response.name;
        }
        // If no team, the user can create a new one, TeamName remains an empty string
      },
      error => {
        console.error('Error fetching team:', error);
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
  
  onFileSelect(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      this.teamLogoFile = eventTarget.files[0];
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
        console.error('Error deleting team member:', error);
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
                console.error('Error uploading team logo:', logoUploadError);
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
          console.error('Error creating team:', error);
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
          console.log('Team details updated successfully', response);
          this.openSuccessDialog();

        },
        error => {
          // Handle the error scenario
          console.error('Error updating team details:', error);
        }
      );
    } else {
      // Handle the case where team name is empty or team ID is not available
      console.error('Team name is required');
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
          console.log("Logo URL:", logoUrl);

// For debugging purposes only
this.teamLogoUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(logoUrl);
        } else {
          console.error('Logo URL is empty or undefined.');
        }
      },
      error => {
        console.error('Failed to fetch team logo:', error);
      }
    );
  }
  
  


  updateTeamLogo(): void {
    if (this.teamLogoFile) {
      const formData = new FormData();
      formData.append('file', this.teamLogoFile);
  console.log(this.teamLogoFile);
      // Assuming teamId is necessary to identify which team's logo to update
      this.userService.updateTeamLogo(formData).subscribe(
        response => {
          // Handle successful logo update
          console.log('Team logo updated successfully', response);
          this.openSuccessDialog();
        },
        error => {
          // Handle error scenario
          console.error('Error updating team logo:', error);
        }
      );
    } else {
      console.error('A logo file must be selected');
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
                this.openSuccessDialog();
                this.router.navigate(['/add-member']);
              },
              logoUploadError => {
                // Handle logo upload error
                console.error('Error uploading team logo:', logoUploadError);
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
          console.error('Error creating team:', error);
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
            console.log('Team successfully deleted');
            // ... additional success handling ...
          },
          error => {
            console.error('Error deleting team:', error);
            // Handle the error scenario, such as displaying an error message
          }
        );
      } else {
        // Deletion cancelled, handle accordingly
        console.log('Deletion cancelled');
        // ... additional handling for cancellation ...
      }
    });
  }
  


  

}
