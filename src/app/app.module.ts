import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TostComponent } from './components/toasts/tost/tost.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ToastsContainerComponent } from './components/toasts/toasts-container/toasts-container.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HotelSetupComponent } from './components/hotel-setup/hotel-setup.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RatePlanComponent } from './components/rate-plan/rate-plan.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ReportsComponent } from './components/reports/reports.component';
@NgModule({
  declarations: [
    AppComponent,
    TostComponent,
    LoginComponent,
    MainComponent,
    HomeComponent,
    CalendarComponent,
    HotelSetupComponent,
    RoomsComponent,
    RatePlanComponent,
    BookingsComponent,
    ReportsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastsContainerComponent,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
