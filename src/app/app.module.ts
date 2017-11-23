import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RaiseRequestComponent } from './raise-request/raise-request.component';
import { SearchInfoComponent } from './search-info/search-info.component';
import { HttpModule } from '@angular/http';

import { UserInfoService } from './user-info.service';
import { AuthGuardService } from './auth-guard.service';
import { CreateArtifactsService } from "./create-artifacts.service";
import { AddUpdateStudentDetailsService } from "./add-update-student-details.service";
import { MydetailsComponent } from './mydetails/mydetails.component';

const appRoutes: Routes = [
  { path: 'login', component: HomeComponent },
  { path: '', redirectTo:'login',pathMatch:'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'requests', component: RaiseRequestComponent },
  { path: 'search', component: SearchInfoComponent },
  { path: 'mydetails', component: MydetailsComponent },
  { path: 'admindash', component: AdminDashboardComponent, canActivate: [AuthGuardService], },
  { path: '**', redirectTo:'login',pathMatch:'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminDashboardComponent,
    DashboardComponent,
    RaiseRequestComponent,
    SearchInfoComponent,
    MydetailsComponent
  ],
  imports: [
    BrowserModule , BrowserAnimationsModule,FormsModule,ReactiveFormsModule,HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } 
    )
  ],
  providers: [UserInfoService,AuthGuardService,CreateArtifactsService,AddUpdateStudentDetailsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
