import { Injectable } from '@angular/core';
import { HttpModule,Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserInfoService {
  userToken:any;
  userOrg:any;
  userName:any;
  adminUser:boolean;
  constructor(private http:Http) { }
  setUser(user,name,org){
    this.userToken = user.token;
    this.userOrg = org;
    this.userName = name;
    this.adminUser = true;
    /*if(name == 'admin'){
      this.adminUser = true;
    }*/
  }
  isAdmin(){
    return true;
  }
  getUserToken(){
    return this.userToken;
  }
  getUserName(){
    return this.userName;
  }
  enrollUSer(formdata){
    return this.http.post(' http://localhost:4000/users',formdata).map(res => res.json()) 
  }
  registerUser(formData){
    console.log(formData);
    return this.http.post(' http://localhost:4000/register',formData).map(res => res.json()) 
  }
  
}
