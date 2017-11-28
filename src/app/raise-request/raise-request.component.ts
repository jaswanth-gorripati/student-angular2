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
    this.request(0);
    this.userInfo.getUserDetailsFromNetwork().subscribe(res =>{
      console.log(res);
      this.userDetailsInNetwork = res[0].Details;
      console.log("userDetails:",this.userDetailsInNetwork)
      for(let i=0;i<this.userDetailsInNetwork.education.length;i++){
        this.eduOptions.push(this.userDetailsInNetwork.education[i].degree);
      }
      console.log("eduoptions:",this.eduOptions);
    })
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
  gotUpdateRequest = false;
  updateEduIndexes:any;
  tempEduDetails:any;
  eduOptions:any = [];
  updateRequest(){
    this.setPeers();
    this.gotUpdateRequest = true;
    this.gotAddRequest = false;
  }
  eduToEdit:any;
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
