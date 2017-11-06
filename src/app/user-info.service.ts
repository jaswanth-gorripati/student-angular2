import { Injectable } from '@angular/core';

@Injectable()
export class UserInfoService {
  User:any;
  constructor() { }
  setUser(user){
    this.User = user;
  }
  isAdmin(){
    return true;
  }
}
