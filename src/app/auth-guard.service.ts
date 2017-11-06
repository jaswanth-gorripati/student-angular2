import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { UserInfoService } from './user-info.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private userInfo:UserInfoService){}
  canActivate() {
    console.log('i am checking to see if you are logged in');
    if(!this.userInfo.isAdmin()){
      alert("not authorised")
    }
    return this.userInfo.isAdmin();
  }

  canActivateChild() {
    console.log('checking child route access');
    return true;
  }

}
