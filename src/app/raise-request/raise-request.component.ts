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
  user:any;
  userDetailsInNetwork:any;
  isValidRequest = false;
  accountType:any;
  idFound = false;
  expOptions:any =[];
  companyToEdit:any;
  acadamicNetwork:any = {"peers":['peer1','peer2'],"channelName":'acadamics',"chaincodeName":"mycc"}
  constructor(public fb: FormBuilder,private userInfo: UserInfoService,private addOrUpdate: AddUpdateStudentDetailsService) {
    this.token = this.userInfo.getUserToken();
    console.log(this.token);
    this.addOrUpdate.setToken(this.token);
    this.userName = this.userInfo.getUserName();
    this.userName = this.userName.toUpperCase();
    this.accountType = this.userInfo.AccountType();
    this.user = this.userInfo.getAttrs();
   }

  ngOnInit() {
    if(this.accountType == "employer"){
      this.request(1);
      this.addWorkRequest();
    }else{
      this.request(0);
      this.addRequest();
    }
    if(this.accountType == 'student'||this.accountType == 'employee'){
      this.userInfo.getUserDetailsFromNetwork().subscribe(res =>{
        console.log(res);
        this.userDetailsInNetwork = res[0].Details;
        console.log("userDetails:",this.userDetailsInNetwork)
        if(this.userDetailsInNetwork.education != undefined){
          for(let i=0;i<this.userDetailsInNetwork.education.length;i++){
            this.eduOptions.push(this.userDetailsInNetwork.education[i].degree);
          }
          console.log("eduoptions:",this.eduOptions);
        }
        if(this.userDetailsInNetwork.experience != undefined){
          for(let i=0;i<this.userDetailsInNetwork.experience.length;i++){
            this.expOptions.push(this.userDetailsInNetwork.experience[i].organisation);
          }
          console.log("eduoptions:",this.expOptions);
        }
      })
    }
  }
  request(index){
    this.forms[index]=1;
    for(let i=0;i<4;i++){
      if(i!=index){
        this.forms[i]=0;
      }
    }
  }
  forSUE(){
    if(this.accountType=="student" || this.accountType ==="employee" || (this.accountType === "universityStaff"))
      return true;
    else
      return false;
  }
  forSE(){
    if(this.accountType=="student" || this.accountType ==="employee")
      return true;
    else
      return false;
  }
  forSEE(){
    if(this.accountType ==="employee" || (this.accountType === "employer"))
      return true;
    else
      return false;
    
  }
  forAdmins(){
    if(this.forms[0]){
      if(this.accountType !="employee" && this.accountType != "student"){
        if( this.idFound == false){
          return true;
        }else{
          return false;
        }
      }
      else
        return false;
    }
  }
  workIdFound = false;
  forWorkAdmins(){
    if(this.forms[1]){
      if(this.accountType =="employer"){
        if( this.workIdFound == false){
          return true;
        }else{
          return false;
        }
      }
      else
        return false;
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
    this.cancel();
    if(this.accountType != "employee" && this.accountType != "student"){
      this.isValidRequest = false;
      this.gotAddRequest = true;
    }else{
      this.setPeers();
      this.request(0);
      this.gotAddRequest = true;
      this.addEduDetails = true;
      console.log("index :",this.addEduIndex)
      this.isValidRequest = true;
      /*this.isUniqueID.controls['args'].setValue([""+this.isUniqueID.controls.uniqueId.value+""]);
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
      })*/
    }
  }
  forAdminrequest(){
    this.idFound = true;
    this.addEduDetails = true;
    this.isValidRequest = true;
  }
  forWorkAdminrequest(){
    this.workIdFound = true;
    this.addWorkDetailsForm = true;
    this.isValidRequest = true;
  }
  gotUpdateRequest = false;
  updateEduIndexes:any;
  tempEduDetails:any;
  eduOptions:any = [];
  updateRequest(){
    this.cancel();
    if(this.accountType != "employee" && this.accountType != "student"){
      this.isValidRequest = true;
      this.gotUpdateRequest = true;
    }else{
      this.request(0);
      this.setPeers();
      this.gotUpdateRequest = true;
    }
  }
  gotExpAddRequest = false;
  gotExpUpdateRequest = false;
  addWorkDetailsForm = false;
  addWorkRequest(){
    this.cancel()
    this.workIdFound =false;
    if(this.accountType == "employer"){
      this.request(1);
      this.isValidRequest = false;
      this.gotExpAddRequest = true;
    }else{
      this.setPeers();
      this.request(1);
      this.gotExpAddRequest = true;
      this.addWorkDetailsForm = true;
      this.isValidRequest = true;
    }
  }
  updateWorkRequest(){
    this.cancel();
    if(this.accountType != "employee"){
      this.isValidRequest = false;
      this.gotExpUpdateRequest = true;
    }else{
      this.request(1);
      this.setPeers();
      this.gotExpUpdateRequest = true;
    }
  }
  personalUpdate = false;
  editProfile(){
    this.cancel()
    this.personalUpdate = true;
  }
  eduToEdit:any;

  getWorkForm(){
    let isOk=false;
    this.removeWork(0);
    for(let i=0;i<this.userDetailsInNetwork.experience.length;i++){
     if(this.companyToEdit == this.userDetailsInNetwork.experience[i].organisation){
       console.log(this.userDetailsInNetwork.experience[i]);
       let dojstr = this.userDetailsInNetwork.experience[i].dateOfJoining;
       let doj =dojstr.split('T');
       let dorstr = this.userDetailsInNetwork.experience[i].dateOfRelieving;
       let dor = dorstr.split('T');
       let form =this.fb.group({
        companyName:[this.userDetailsInNetwork.experience[i].organisation,Validators.required],
        designation:[this.userDetailsInNetwork.experience[i].designation,Validators.required],
        yearOfJoining:[doj[0],Validators.required],
        dor:[dor[0],Validators.required],
        location:[this.userDetailsInNetwork.experience[i].Location,Validators.required],
        stillWorking:[this.userDetailsInNetwork.experience[i].StillWork,Validators.required]
       });
       console.log(form);
       let control=<FormArray>this.workForm.controls['experience'];
       control.push(form);
       isOk=true;
       this.isValidRequest=true;
       this.addWorkDetailsForm=true;
       
      } 
    }
  }
  
  getEduForm(){
    let  isOk = false;
    this.removeEdu(0);
    for(let i=0;i<this.userDetailsInNetwork.education.length;i++){
      if(this.eduToEdit == this.userDetailsInNetwork.education[i].degree){
        console.log(this.userDetailsInNetwork.education[i]);
        let form = this.fb.group({
          degree:[this.userDetailsInNetwork.education[i].degree,Validators.required],
          board:[this.userDetailsInNetwork.education[i].board,Validators.required],
          collegeName: [this.userDetailsInNetwork.education[i].Institute, Validators.required],
          completedYear: [""+this.userDetailsInNetwork.education[i].yearOfPassout+"", Validators.required],
          score:[""+this.userDetailsInNetwork.education[i].score+"",Validators.required]
        });
        let control = <FormArray>this.addForm.controls['education'];
        control.push(form);
        isOk = true;
        this.isValidRequest =true;
        this.addEduDetails=true;
      }
    }
  }
  isExists(event){
    console.log(this.isUniqueID.value);
  }
  cancel(){
    this.idFound = false;
    this.personalUpdate = false
    this.gotExpAddRequest = false;
    this.gotExpUpdateRequest = false;
    this.addWorkDetailsForm = false;
    this.addEduDetails =false;
    this.isValidRequest =false;
    this.addForm.reset();
    this.workForm.reset();
    this.isValidRequest = false;
    this.gotAddRequest = false;
    this.gotUpdateRequest = false;
    this.eduToEdit = "";
  }
  public workForm = this.fb.group({
    experience: this.fb.array([
      this.initWork(),
    ])
  });
  initWork(){
    return this.fb.group({
      designation:["",Validators.required],
      yearOfJoining:["",Validators.required],
      companyName:["",Validators.required],
      location:["",Validators.required],
      dor:[""],
      stillWorking:[false]
     });
  }
  updateExpRequest(){
    alert('hi');

    
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
  addWork() {
    // add address to the list
    const control = <FormArray>this.workForm.controls['experience'];
    control.push(this.initWork());
  }

  removeWork(i: number) {
      // remove address from the list
      const control = <FormArray>this.workForm.controls['experience'];
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
        
      }else if(this.addEduDetails){
        submitForm.fcn="RequestEnroll";
        submitForm.args = [];
        let temp = this.addForm.controls.education.value;
        console.log("temp:",temp)
        for(let i=0;i<temp.length;i++){
            submitForm.args.push(temp[i].degree,temp[i].score,temp[i].completedYear,temp[i].collegeName,"Hyderabad",temp[i].board,"Add");
        }
        this.submitAdd(submitForm);
        this.addForm.controls.education.reset();
      } 
      console.log(this.addForm.value)
      console.log(submitForm);
    }else{
      let i =0;
      submitForm.fcn="RequestEnroll";
      let temp = this.addForm.controls.education.value;
      console.log(temp)
      submitForm.args.push(temp[i].degree,temp[i].score,temp[i].completedYear,temp[i].collegeName,"Hyderabad",temp[i].board,"Update");
      this.submitAdd(submitForm)
      this.addForm.controls.education.reset();
    }  
  }
  addworkDetails(){
    let submitForm = {'fcn':"","peers":['peer1','peer2'],"args":[],"channelName":"profession","chaincodeName":"workchain","chaincodeVersion":"v0"};
    if(this.gotExpAddRequest == true){ 
     if(this.addWorkDetailsForm){
        submitForm.fcn="ExperienceRequest";
        submitForm.args = [];
        let temp = this.workForm.controls.experience.value;
        console.log("temp:",temp)
        for(let i=0;i<temp.length;i++){
            submitForm.args.push("Add",temp[i].designation,temp[i].yearOfJoining,temp[i].companyName,temp[i].location,temp[i].dor,""+temp[i].stillWorking+"");
        }
        this.submitExpAdd(submitForm);
        this.workForm.controls.experience.reset();
      } 
      console.log(this.workForm.value)
      console.log(submitForm);
    }else if(this.gotExpUpdateRequest == true){
      let i =0;
      submitForm.fcn="ExperienceRequest";
      let temp = this.workForm.controls.experience.value;
      console.log(temp)
      submitForm.args.push("Update",temp[i].designation,temp[i].yearOfJoining,temp[i].companyName,temp[i].location,temp[i].dor,""+temp[i].stillWorking+"");
      this.submitExpAdd(submitForm)
      this.workForm.controls.experience.reset();
    }  
  }
  Success = false;
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
  submitExpAdd(submitForm){
    this.Success = false;
    console.log("from submission",submitForm)
    this.addOrUpdate.addWorkDetails(submitForm).subscribe(resp =>{
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
