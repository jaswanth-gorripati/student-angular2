import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder,FormControl,FormArray, Validators } from '@angular/forms';
import { UserInfoService } from "../user-info.service";
import { AddUpdateStudentDetailsService } from "../add-update-student-details.service";
@Component({
  selector: 'raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.css']
})
export class RaiseRequestComponent implements OnInit {
  forms = [0,0,0,0,0]
  token:any;
  userName:any;
  isValidRequest = false;
  constructor(public fb: FormBuilder,private userInfo: UserInfoService,private addOrUpdate: AddUpdateStudentDetailsService) {
    this.token = this.userInfo.getUserToken();
    console.log(this.token);
    this.addOrUpdate.setToken(this.token);
    this.userName = this.userInfo.getUserName();
   }

  ngOnInit() {
    this.request(0);
  }
  request(index){
    this.forms[index]=1;
    for(let i=0;i<5;i++){
      if(i!=index){
        this.forms[i]=0;
      }
    }
  }
  public isUniqueID = this.fb.group({
    uniqueId:["1",Validators.required],
    channelName: ["mychannel", Validators.required],
    chaincodeName:["mycc",Validators.required],
    chaincodeVersion:["v0",Validators.required],
    peer1:["", Validators.required],
    peer2:["", Validators.required],
    peers:[[],Validators.required],
    fcn:["getHistory",Validators.required],
    args:[[]],
  });
  
  gotAddRequest = false;
  addWithPersonal = false;
  addEduDetails = false;
  addRequest(){
    this.setPeers();
    this.gotAddRequest = true;
    this.gotUpdateRequest =false;
    this.isUniqueID.controls['args'].setValue([this.isUniqueID.controls.uniqueId.value]);
    let submitForm = {"fcn":"getHistory","args":this.isUniqueID.controls.uniqueId.value}
    this.addOrUpdate.isStudentExists(this.isUniqueID.value,submitForm).subscribe(res =>{
      console.log("from add Request: ",res);
      if(res[0] != undefined){
        this.addEduDetails = true;
      }else{
        this.addWithPersonal = true;
      }
      this.isValidRequest = true;
    })
  }
  gotUpdateRequest = false;
  updateRequest(){
    this.setPeers();
    this.gotUpdateRequest = true;
    this.gotAddRequest = false;
    this.isUniqueID.controls['args'].setValue([this.isUniqueID.controls.uniqueId.value]);
    let submitForm = {"fcn":"getHistory","args":this.isUniqueID.controls.uniqueId.value}
    this.addOrUpdate.isStudentExists(this.isUniqueID.value,submitForm).subscribe(res =>{
      console.log("from add Request: ",res);
      if(res[0] == undefined){
        alert("not found");
      }else{
        this.addEduDetails = true;
        let index = res.length - 1; 
        this.removeEdu(0);
        /*this.addForm.controls['name'].setValue(res[index].StudentDetails.username);
        this.addForm.controls['dob'].setValue(res[index].StudentDetails.DateOfBirth)
        this.addForm.controls['gender'].setValue(res[index].StudentDetails.gender)*/
        for(let i=0;i<res[index].StudentDetails.education.length;i++){
          let form = this.fb.group({
            degree:[res[index].StudentDetails.education[i].degree,Validators.required],
            board:[res[index].StudentDetails.education[i].board,Validators.required],
            collegeName: [res[index].StudentDetails.education[i].Institute, Validators.required],
            completedYear: [""+res[index].StudentDetails.education[i].yearOfPassout+"", Validators.required],
            score:[""+res[index].StudentDetails.education[i].score+"",Validators.required],
            user:[res[index].StudentDetails.education[i].addedBy],
            date:[res[index].StudentDetails.education[i].addedTime]
          });
          let control = <FormArray>this.addForm.controls['education'];
          control.push(form);
        }
      }
      this.isValidRequest = true;
    })
  }
  isExists(event){
    console.log(this.isUniqueID.value);
  }
  public addForm = this.fb.group({
    name:["",Validators.required],
    dob:["",Validators.required],
    gender:["",Validators.required],
    education: this.fb.array([
      this.initEducation(),
    ])
  });
  initEducation(){
    return this.fb.group({
      degree:["",Validators.required],
      board:["",Validators.required],
      collegeName: ['', Validators.required],
      completedYear: ["", Validators.required],
      score:["",Validators.required],
      user:[this.userName],
      date:["2017-02-02"]
     });
  }
  addEdu() {
      // add address to the list
      const control = <FormArray>this.addForm.controls['education'];
      control.push(this.initEducation());
  }

  removeEdu(i: number) {
      // remove address from the list
      const control = <FormArray>this.addForm.controls['education'];
      control.removeAt(i);
  }
  setPeers(){
    if(this.isUniqueID.controls.peer1.value == true && this.isUniqueID.controls.peer2.value != true  ){
      this.isUniqueID.controls['peers'].setValue(['peer1']);
    }else if(this.isUniqueID.controls.peer2.value == true  && this.isUniqueID.controls.peer1.value != true ){
      this.isUniqueID.controls['peers'].setValue(['peer2']);
    }else if(this.isUniqueID.controls.peer1.value == true && this.isUniqueID.controls.peer2.value == true  ){
      this.isUniqueID.controls['peers'].setValue(['peer1','peer2']);
    }
  }
  addDetails(event){
   let submitForm = {'fcn':"","peers":[],"args":[],"channelName":"","chaincodeName":"","chaincodeVersion":""};
    this.setPeers()
    submitForm.peers=this.isUniqueID.controls.peers.value;
    submitForm.channelName = this.isUniqueID.controls.channelName.value;
    submitForm.chaincodeName = this.isUniqueID.controls.chaincodeName.value;
    submitForm.chaincodeVersion = this.isUniqueID.controls.chaincodeVersion.value;
    if(this.gotAddRequest == true){ 
      if(this.addWithPersonal){
        submitForm.fcn="register";
        submitForm.args.push(this.isUniqueID.controls.uniqueId.value,"",this.addForm.controls.name.value,this.addForm.controls.dob.value,this.addForm.controls.gender.value,this.userName,"2017-02-02");
        let temp = this.addForm.controls.education.value;
        for(let i=0;i<temp.length;i++){
          submitForm.args.push(temp[i].degree,temp[i].board,temp[i].collegeName,temp[i].completedYear,temp[i].score,this.userName,temp[i].date);
        }
        this.submitAdd(submitForm);
        setTimeout(()=>{
          submitForm.fcn = "cwcu";
          submitForm.args = [this.isUniqueID.controls.uniqueId.value,"2","SCADMIN","jntu","admin"];
          this.submitAdd(submitForm);
        },5000)
        
      }else if(this.addEduDetails){
        submitForm.fcn="addEducation";
        submitForm.args.push(this.isUniqueID.controls.uniqueId.value)
        let temp = this.addForm.controls.education.value;
        console.log("temp:",temp)
        for(let i=0;i<temp.length;i++){
            submitForm.args.push(temp[i].degree,temp[i].board,temp[i].collegeName,temp[i].completedYear,temp[i].score,this.userName,temp[i].date);
        }
        this.submitAdd(submitForm);
        setTimeout(()=>{
          submitForm.fcn = "cwcu";
          submitForm.args = [this.isUniqueID.controls.uniqueId.value,"2","SCADMIN","jntu","admin"];
          this.submitAdd(submitForm);
        },5000)
      } 
      console.log(this.addForm.value)
      console.log(submitForm);
    }else{
      let i =2;
      submitForm.fcn="updateEdu";
      let temp = this.addForm.controls.education.value;
      submitForm.args.push(this.isUniqueID.controls.uniqueId.value,""+i+"",this.userName,temp[i].degree,temp[i].board,temp[i].collegeName,temp[i].completedYear,temp[i].score);
      this.submitAdd(submitForm)
    }  
    
  }
  submitAdd(submitForm){
    console.log("from submission",submitForm)
    this.addOrUpdate.addDetails(submitForm).subscribe(resp =>{
      console.log(resp);
      this.addWithPersonal = false;
      this.addEduDetails =false;
      this.isValidRequest =false;
      this.addForm.controls.education.reset();
      if(resp == ""){
        alert("operation Succesful");
      }else{
        alert(resp);
      }
      //this.addForm.reset();
    })
  }
  //[$scope.studentDetails.studentId,$scope.profilePicture,$scope.studentDetails.studentName,$scope.studentDetails.studentDOB,$scope.studentDetails.studentGender,$rootScope.userName,$rootScope.date,$scope.studentDetails.studentDegree,$scope.studentDetails.studentBoard,$scope.studentDetails.studentInstitute,$scope.studentDetails.studentPassedOut,$scope.studentDetails.studentScore,$rootScope.userName,$rootScope.date];

}
