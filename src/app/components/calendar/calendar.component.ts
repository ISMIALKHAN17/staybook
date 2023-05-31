import { Component } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentTime: Date = new Date();
  selectedDate: NgbDateStruct | any;

  constructor( private calendar: NgbCalendar) {
    this.selectedDate = calendar.getToday();
    setInterval(() => {
      this.currentTime = new Date(); // Update the current time every second
    }, 1000);
  }



  onDateSelect(date: NgbDateStruct) {
    // Handle the selected date
    if(10  >= 12){
      console.log(`this date is selected over new setup ${this.selectedDate}`)
    }else{
      console.log((this.selectedDate.day))
    }
  }
}
