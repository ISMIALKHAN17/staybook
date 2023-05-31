import { Component } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentTime: Date = new Date();
  selectedDate: NgbDateStruct | any;

  constructor( private calendar: NgbCalendar) {
    setInterval(() => {
      this.currentTime = new Date(); // Update the current time every second
    }, 1000);
  }
  onDateSelect(date: NgbDateStruct) {
    // Handle the selected date
    console.log(date);
  }
}
