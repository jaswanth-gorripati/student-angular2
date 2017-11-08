import { Injectable } from '@angular/core';
import { HttpModule,Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AddUpdateStudentDetailsService {
  token:any;
  constructor(private http:Http) { }
  setToken(token){
    this.token = token;
  }
  getToken(){
    return this.token;
  }
  headers(){
    let headers = new Headers();
    headers.append('authorization','Bearer '+ this.token);
    headers.append('content-Type', 'application/json');
    
    var options = new RequestOptions({ headers: headers });
    return options;
  }
  isStudentExists(network,form){
    return this.http.post(' http://localhost:4000/channels/'+network.channelName+'/chaincodes/'+network.chaincodeName+'',form,this.headers()).map(res => res.json())
  }
  addDetails(formdata){
    return this.http.post(' http://localhost:4000/channels/'+formdata.channelName+'/chaincodes/'+formdata.chaincodeName+'',formdata,this.headers()).map(res => res.text())
  }
}
