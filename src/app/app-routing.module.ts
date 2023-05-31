import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { HotelSetupComponent } from './components/hotel-setup/hotel-setup.component';
import { RoomsComponent } from './components/rooms/rooms.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'hotel-setup', component:HotelSetupComponent},
  {path:'rooms', component:RoomsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
