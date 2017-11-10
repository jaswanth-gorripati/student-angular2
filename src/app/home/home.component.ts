import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { UserInfoService } from "../user-info.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public fb: FormBuilder,private userInfo: UserInfoService) { }
  ngOnInit() {}

  @Output() messageEvent = new EventEmitter<boolean>();

  isOrgValid(c: FormControl) {
    if(c.value === "org1" || c.value ==="org2") {
      console.log('valid')
      return {
        notvalid: true
      }
    }else if (c.value != "org1" && c.value !="org2"){
      console.log('not valid')
      return{
        notvalid:false
      }
    }else{
      console.log('con valid')
      return{
        notvalid: true
      }
    }
  
  }
  notStudent = false;
  login = true;

  public loginForm = this.fb.group({
    username: ["scadmin", Validators.required],
    passkey: ["pass", Validators.required],
    orgName:["org1",[Validators.required]]
  });

  public registerForm = this.fb.group({
    username: ["", Validators.required],
    passkey: ["", Validators.required],
    orgName:["", Validators.required],
    position:["", Validators.required]
  });

  getWorkForm(){
    this.notStudent = !this.notStudent;
  }
  
  enroll(event) {
    console.log(event);
    this.userInfo.enrollUSer(this.loginForm.value).subscribe(res => {
      console.log(res);
      if(res.success){
        this.userInfo.setUser(res,this.loginForm.controls.username.value,this.loginForm.controls.orgName.value)
       console.log(this.userInfo.getUserToken());
        this.messageEvent.emit(true);
      }
    });
  }

  register(event){
    console.log(event);
    this.userInfo.registerUser(this.registerForm.value).subscribe(res => {
      console.log(res);
      if(res.success){
        alert("successfully registered .. can LOGIN NOW ")
        this.login = true;
      }
    });
  }
}
