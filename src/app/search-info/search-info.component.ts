import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'search-info',
  templateUrl: './search-info.component.html',
  styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements OnInit {

  details:any;
  constructor() { }

  ngOnInit() {
    this.details = {'name':'Gorripati Jaswanth Naiduuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu','dob':'1994-12-16','age':'23','father':'gorripati kesaval naidu',
                    'education':[
                      {'degree':'ssc','board':'secondary','score':98,'clgName':'little','clgCode':'lill'},
                      {'degree':'inter','board':'intermediate','score':93,'clgName':'chaitanya','clgCode':'chai'},
                      {'degree':'ssc','board':'secondary','score':87,'clgName':'vignan','clgCode':'vitae'}
                  ],
                    'work':[
                      {"designation":'software developer','company':'archents','location':'hyderabad','workingFrom':2016}
                    ]}
  }

}
