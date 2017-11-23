import { Component, OnInit } from '@angular/core';
import { UserInfoService } from "../user-info.service";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  details:any;
  constructor(private userInfo: UserInfoService) { }
  public form = [true,false,false];
  user:any = [];
  accounType:any;
  ngOnInit() {
    this.details = {'name':'VIGNAN','dob':'JNTU','age':'Hyderabad','father':'Admin',
                    'education':[
                      {'degree':'12uq1a0434','board':'Add Request','score':98,'clgName':'little','clgCode':'2013'},
                      {'degree':'13uq1a0987','board':'Add Request','score':93,'clgName':'chaitanya','clgCode':'2015'},
                      {'degree':'13uy45y654','board':'Update Request','score':87,'clgName':'vignan','clgCode':'2016'},
                      {'degree':'12uq1a0yu4','board':'Add Request','score':98,'clgName':'little','clgCode':'2013'},
                      {'degree':'15uqhgft87','board':'Update Request','score':93,'clgName':'chaitanya','clgCode':'2014'},
                      {'degree':'1yuy45y654','board':'Update Request','score':87,'clgName':'vignan','clgCode':'2000'}
                  ]}
    this.accounType = this.userInfo.AccountType();
    this.user = this.userInfo.getAttrs();
    this.user.name = this.userInfo.getUserName();
  }
  changeForm(index){
    this.form[index] = true;
    for(let i=0;i<3;i++){
      if(i != index){
        this.form[i] = false;
      }
    }
  }
}
