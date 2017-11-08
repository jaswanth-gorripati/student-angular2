import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { UserInfoService } from "../user-info.service";
import { CreateArtifactsService } from "../create-artifacts.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  forms = [0,0,0,0,0]
  token:any;
  constructor(public fb: FormBuilder,private userInfo: UserInfoService,private createArtifacts:CreateArtifactsService) {
    this.token = this.userInfo.getUserToken();
    console.log(this.token);
    this.createArtifacts.setToken(this.token);
   }

  ngOnInit() {
    this.request(0);
  }
  request(index){
    this.forms[index]=1;
    for(var i=0;i<5;i++){
      if(i!=index){
        this.forms[i]=0;
      }
    }
  }

  public channelForm = this.fb.group({
    channelName: ["", Validators.required],
    channelConfigPath: ["../artifacts/channel/mychannel.tx", Validators.required]
  });
  createChannel(event){
    this.createArtifacts.createChannel(this.channelForm.value,this.token).subscribe(resp =>{
      console.log(resp);
      alert(resp.message);
      this.channelForm.reset();
    })
  }
  public joinForm = this.fb.group({
    channelName :["", Validators.required],
    peer1:["", Validators.required],
    peer2:["", Validators.required]
  });
  joinChannel(event){
    console.log(this.joinForm.value);
    let peers={"peers":[]};
    if(this.joinForm.controls.peer1.value == true ){
      peers.peers.push("peer1")
    }
    if(this.joinForm.controls.peer2.value == true ){
      peers.peers.push("peer2")
    }
    console.log(peers)
    this.createArtifacts.joinChannel(this.joinForm.controls.channelName.value,peers).subscribe(res =>{
      console.log(res);
      alert(res.message);
      this.joinForm.reset()
    })
  }
  chaincodePath = "github.com/example_cc";
  args = ["a","100","b","200"];
  public installForm = this.fb.group({
    chaincodeName :["", Validators.required],
    chaincodeVersion :["", Validators.required],
    chaincodePath:[this.chaincodePath,Validators.required],
    channelName:["",Validators.required],
    peer1:["", Validators.required],
    peer2:["", Validators.required],
    peers:[[],Validators.required],
    args:[[],Validators.required]
  });
  installChaincode(event){
    console.log(this.installForm.value);
    let peers={"peers":[]};
    if(this.installForm.controls.peer1.value == true && this.installForm.controls.peer2.value != true  ){
      this.installForm.controls['peers'].setValue(['peer1']);
    }else if(this.installForm.controls.peer2.value == true  && this.installForm.controls.peer1.value != true ){
      this.installForm.controls['peers'].setValue(['peer2']);
    }else if(this.installForm.controls.peer1.value == true && this.installForm.controls.peer2.value == true  ){
      this.installForm.controls['peers'].setValue(['peer1','peer2']);
    }
    console.log(this.installForm.value);
    this.createArtifacts.installChaincode(this.installForm.value).subscribe(res =>{
      console.log(res);
      this.installForm.reset()
      alert(res.text())
     
    })
  }
  instantiateForm(event){
    console.log(this.installForm.value);
    this.installForm.controls['args'].setValue(["a","100","b","200"]);
    let peers={"peers":[]};
    if(this.installForm.controls.peer1.value == true && this.installForm.controls.peer2.value != true  ){
      this.installForm.controls['peers'].setValue(['peer1']);
    }else if(this.installForm.controls.peer2.value == true  && this.installForm.controls.peer1.value != true ){
      this.installForm.controls['peers'].setValue(['peer2']);
    }else if(this.installForm.controls.peer1.value == true && this.installForm.controls.peer2.value == true  ){
      this.installForm.controls['peers'].setValue(['peer1','peer2']);
    }
    console.log(this.installForm.value);
    this.createArtifacts.instantiateChaincode(this.installForm.value).subscribe(res =>{
      console.log(res);
      this.installForm.reset()
      alert(res.text())
     
    })
  }
}
