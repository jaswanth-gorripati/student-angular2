import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserInfoService } from './user-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserInfoService],
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router,private userInfo:UserInfoService) {}

  
  title = 'app';
  loggedIn = false;
  user:any;
  isAdmin:any;
  AccountType:any;
  receiveMessage($event) {
    this.loggedIn = $event;
    this.isAdmin = this.userInfo.isAdmin();
    this.AccountType = this.userInfo.AccountType();
    this.user = this.userInfo.getUserName();
    if(this.user=="admin"){
      this.router.navigate(["/admindash"]);
    }else
      this.router.navigate(["/dashboard"]);
  }
}
