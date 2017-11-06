import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.css']
})
export class RaiseRequestComponent implements OnInit {
  forms = [0,0,0,0,0]
  openForm=[0,0]
  constructor() { }

  ngOnInit() {
    this.request(0);
    this.AEform(0)
  }
  request(index){
    this.forms[index]=1;
    this.AEform(0)
    for(var i=0;i<5;i++){
      if(i!=index){
        this.forms[i]=0;
      }
    }
  }
  AEform(index){
    this.openForm[index] = 1;
    for(var i=0;i<2;i++){
      if(i!=index){
        this.openForm[i]=0;
      }
    }
  }

}
