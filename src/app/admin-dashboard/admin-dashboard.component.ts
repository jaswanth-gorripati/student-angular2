import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
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
  constructor() { }

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
}
