import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { UserInfoService } from "../user-info.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  names: string[] = ["student", "employee", "employer", "college/school staff"];

  constructor(public fb: FormBuilder,private userInfo: UserInfoService,private element: ElementRef) {
    
  }
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
    username: ["jaswanth", Validators.required],
    passkey: ["pass", Validators.required],
    orgName:["org1",[Validators.required]]
  });

  public registerForm = this.fb.group({
    uniqueid:["",Validators.required],
    username: ["", Validators.required],
    dob:['',Validators.required],
    gender:['',Validators.required],
    email:['example@gmail.com',Validators.required],
    passkey: ["", Validators.required],
    orgName:["", Validators.required],
    position:[" ", Validators.required],
    aType:["student",Validators.required],
    isAdmin:[false,Validators.required],
    profilePic:["",Validators.required]
  });

  getWorkForm(){
    this.notStudent = !this.notStudent;
  }
 
changeListner(event) {
  var reader = new FileReader();
  var image = this.element.nativeElement.querySelector('.image');
  var temp;
  reader.onload = function(e) {  
      temp = reader.result;
      console.log(temp);
      image.src=reader.result;
      
  };

  reader.readAsDataURL(event.target.files[0]);
  console.log("image",temp)
  setTimeout(()=>{
    this.registerForm.controls['profilePic'].setValue(temp);
    console.log("profile pic :",this.registerForm.controls.profilePic.value)
  },500)
 
}
showFiles(){
  this.element.nativeElement.querySelector('#file').click();
}
clearFiles(){
  this.element.nativeElement.querySelector('#file').value = null;
}
  enroll(event) {
    console.log(event);
    this.userInfo.enrollUSer(this.loginForm.value).subscribe(res => {
      console.log(res);
      if(res.success){
        this.userInfo.setUser(res,this.loginForm.controls.username.value,this.loginForm.controls.orgName.value);
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
        if(this.registerForm.controls.aType.value === "student" || this.registerForm.controls.aType.value ==="employee"){
          let submitForm = {"fcn":"register","args":[this.registerForm.controls.uniqueid.value,this.registerForm.controls.profilePic.value,this.registerForm.controls.username.value,this.registerForm.controls.dob.value,this.registerForm.controls.gender.value,this.registerForm.controls.email.value,this.registerForm.controls.aType.value]}
          this.userInfo.registerToNetwork(submitForm)
          alert("Registration Successfull .. Can Login Now")
          this.login = true;
        }
      }
    });
  }
}
