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
    this.userName = this.userName.toUpperCase();
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
  addEduIndex:any;
  addRequest(){
    this.setPeers();
    this.gotAddRequest = true;
    this.gotUpdateRequest =false;
    this.isUniqueID.controls['args'].setValue([""+this.isUniqueID.controls.uniqueId.value+""]);
    let submitForm = {"fcn":"getHistory","args":[this.isUniqueID.controls.uniqueId.value]}
    this.addOrUpdate.isStudentExists(this.isUniqueID.value,submitForm).subscribe(res =>{
      console.log("from add Request: ",res);
      if(res[0] != undefined){
        this.addEduDetails = true;
        this.addEduIndex = res[res.length-1].StudentDetails.education.length-1;
      }else{
        this.addWithPersonal = true;
        this.addEduIndex = 0;
      }
      console.log("index :",this.addEduIndex)
      this.isValidRequest = true;
    })
  }
  gotUpdateRequest = false;
  updateEduIndexes:any;
  tempEduDetails:any;
  updateRequest(){
    this.setPeers();
    this.gotUpdateRequest = true;
    this.gotAddRequest = false;
    this.isUniqueID.controls['args'].setValue([this.isUniqueID.controls.uniqueId.value]);
    let submitForm = {"fcn":"getHistory","args":[this.isUniqueID.controls.uniqueId.value]}
    this.addOrUpdate.isStudentExists(this.isUniqueID.value,submitForm).subscribe(res =>{
      console.log("from add Request: ",res);
      this.tempEduDetails = res;
      if(res[0] == undefined){
        alert("not found");
      }else{
       
        
        /*this.addForm.controls['name'].setValue(res[index].StudentDetails.username);
        this.addForm.controls['dob'].setValue(res[index].StudentDetails.DateOfBirth)
        this.addForm.controls['gender'].setValue(res[index].StudentDetails.gender)*/
      }
    })
  }
  eduToEdit:any;
  getEduForm(){
    let  isOk = false;
    let index = this.tempEduDetails.length - 1; 
    this.removeEdu(0);
    this.addEduDetails = true;
    console.log(this.tempEduDetails);
    for(let i=0;i<this.tempEduDetails[index].StudentDetails.education.length;i++){
      if(this.userName == this.tempEduDetails[index].StudentDetails.education[i].WhoCanupdate.userName && this.eduToEdit == this.tempEduDetails[index].StudentDetails.education[i].degree){
        this.updateEduIndexes = i;
        console.log(this.tempEduDetails[index].StudentDetails.education[i]);
        let form = this.fb.group({
          degree:[this.tempEduDetails[index].StudentDetails.education[i].degree,Validators.required],
          board:[this.tempEduDetails[index].StudentDetails.education[i].board,Validators.required],
          collegeName: [this.tempEduDetails[index].StudentDetails.education[i].Institute, Validators.required],
          completedYear: [""+this.tempEduDetails[index].StudentDetails.education[i].yearOfPassout+"", Validators.required],
          score:[""+this.tempEduDetails[index].StudentDetails.education[i].score+"",Validators.required],
          user:[this.tempEduDetails[index].StudentDetails.education[i].addedBy],
          date:[this.tempEduDetails[index].StudentDetails.education[i].addedTime]
        });
        let control = <FormArray>this.addForm.controls['education'];
        control.push(form);
        isOk = true;
        this.isValidRequest =true;
      }
    }
    
    if(isOk == false){
      alert("no Education details regarding "+this.eduToEdit+" degree");
      this.cancel()
    }
    
  }
  isExists(event){
    console.log(this.isUniqueID.value);
  }
  cancel(){
    this.addWithPersonal = false;
    this.addEduDetails =false;
    this.isValidRequest =false;
    this.addForm.reset();
    this.isValidRequest = false;
    this.gotAddRequest = false;
    this.gotUpdateRequest = false;
    this.eduToEdit = "";
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
          submitForm.args = [this.isUniqueID.controls.uniqueId.value,""+this.addEduIndex+"",this.userName,"jntu","admin"];
          this.callCWCU(submitForm);
        },5000)
        
      }else if(this.addEduDetails){
        submitForm.fcn="addEducation";
        submitForm.args.push(""+this.isUniqueID.controls.uniqueId.value+"")
        let temp = this.addForm.controls.education.value;
        console.log("temp:",temp)
        for(let i=0;i<temp.length;i++){
            submitForm.args.push(temp[i].degree,temp[i].board,temp[i].collegeName,temp[i].completedYear,temp[i].score,this.userName,temp[i].date);
        }
        this.submitAdd(submitForm);
        setTimeout(()=>{
          submitForm.fcn = "cwcu";
          submitForm.args = [this.isUniqueID.controls.uniqueId.value,""+this.addEduIndex+"",this.userName,"jntu","admin"];
          this.callCWCU(submitForm);
        },5000)
      } 
      console.log(this.addForm.value)
      console.log(submitForm);
    }else{
      let i =0;
      submitForm.fcn="updateEdu";
      let temp = this.addForm.controls.education.value;
      console.log(temp)
      submitForm.args.push(this.isUniqueID.controls.uniqueId.value,""+this.updateEduIndexes+"",this.userName,temp[i].degree,temp[i].board,temp[i].collegeName,temp[i].completedYear,temp[i].score);
      this.submitAdd(submitForm)
      this.addForm.controls.education.reset();
    }  
    
  }
  Success = false;
  callCWCU(form){
    if(this.Success == true){
      this.submitAdd(form);
    }else{
      setTimeout(()=> {
        this.callCWCU(form);
      }, 1000);
    }
  }
  submitAdd(submitForm){
    this.Success = false;
    console.log("from submission",submitForm)
    this.addOrUpdate.addDetails(submitForm).subscribe(resp =>{
      console.log(resp);
      this.clearAll();
      if(resp == ""){
        setTimeout(()=> {
          this.Success= true;
          alert("operation Succesful");
        }, 1000);
      }else{
        alert(resp);
      }
      //this.addForm.reset();
    })
  }
  clearAll(){
    this.addWithPersonal = false;
    this.addEduDetails =false;
    this.isValidRequest =false;
    this.gotAddRequest = false;
    this.gotUpdateRequest =false;
    this.tempEduDetails = null;
    this.updateEduIndexes = null;
    this.addForm.controls.education.reset();
  }
  //[$scope.studentDetails.studentId,$scope.profilePicture,$scope.studentDetails.studentName,$scope.studentDetails.studentDOB,$scope.studentDetails.studentGender,$rootScope.userName,$rootScope.date,$scope.studentDetails.studentDegree,$scope.studentDetails.studentBoard,$scope.studentDetails.studentInstitute,$scope.studentDetails.studentPassedOut,$scope.studentDetails.studentScore,$rootScope.userName,$rootScope.date];

}
