import { Component, OnInit, OnDestroy, Renderer2, ElementRef ,ViewEncapsulation, ViewChild } from '@angular/core';
import { IUser } from '../user'; // Import your User model
import { UserService } from '../user-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None // This line should be handled with care

})
export class LandingPageComponent implements OnInit, OnDestroy {
  private script!: HTMLScriptElement;
  user: IUser = {
    firstname: '',
    lastname: '',
    email: '',
    birth_date: '',
    university:'',
    phone:'',
    password:'' // Initialize all required properties with default values
    // Add other properties as needed
  }; // Initialize an empty user object
  showOptions: boolean = false;
  constructor(private renderer: Renderer2, private el: ElementRef , private userService:UserService,private router: Router // Add the router for navigation
  ) {}

  ngOnInit(): void {
    this.script = this.renderer.createElement('script');
    this.script.src = 'assets/js/main.js'; // Path to your script file
    this.script.type = 'text/javascript';
    this.renderer.appendChild(this.el.nativeElement, this.script);
    this.getUserData();
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwtToken');
    return !!token; // Returns true if token exists, false otherwise
}
getUserData() {
  this.userService.getUser().subscribe(
    (response) => {
      // Assuming your user data is returned in the response
      this.user = response;
    },
    (error) => {
      console.error('Error fetching user data', error);
    }
  );
}
@ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

toggleSelectOptions() {
  this.showOptions = !this.showOptions;
 
}


handleUserOption(option: string) {
  if (option === 'logout') {
      localStorage.removeItem('jwtToken'); // Remove the token
      this.router.navigate(['/login']); // Navigate to login or home page
  }
  if (option === 'manage'){
    this.router.navigate(['/manage-account'])
  }
  // Add additional cases if needed for other options like 'manage'
  this.showOptions = false; // Hide the options after selection
}

  ngOnDestroy(): void {
    if (this.script) {
      this.script.remove();
    }
  }
  
}
