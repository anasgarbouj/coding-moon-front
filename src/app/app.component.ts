import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title="CMC"
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('jwtToken');
    if (token){

    this.userService.checkTokenAndLogout();}
  }
}
