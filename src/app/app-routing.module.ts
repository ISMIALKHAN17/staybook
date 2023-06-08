import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HotelSetupComponent } from './components/hotel-setup/hotel-setup.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RatePlanComponent } from './components/rate-plan/rate-plan.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'hotel-setup', component:HotelSetupComponent},
  {path:'rooms', component:RoomsComponent},
  {path:'rate-plans', component:RatePlanComponent},
  {path:'bookings', component:BookingsComponent},
  {path:'reports', component:ReportsComponent},
  {path:'dashboard', component:DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
