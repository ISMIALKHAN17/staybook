import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { DataEncryptService } from 'src/app/services/data-encrypt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  roomDetail:any
  userData:any
  model:any
  endDateMinDate: string | undefined;
  form :any
  rooms:any
  selectedRoom:any
  constructor(private api: RequestService, private Router:Router ,private DataEncrypt:DataEncryptService, private modalService:NgbModal , private formBuilder: FormBuilder ) {}
  ngOnInit(): void {
    const user:any = localStorage.getItem('user')
    this.userData =  this.DataEncrypt.decryptUserData(user)
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalNights: ['', Validators.required],
      room_id: ['Select Room', Validators.required],
      adults: ['', Validators.required],
      kids: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      cnic: [''],
      subTotal: [''],
      discount: [''],
      total: ['']  
    });
  }
  calculateTotalNights() {
    const startDate = this.form.controls.startDate.value;
    const endDate = this.form.controls.endDate.value;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = Math.abs(end.getTime() - start.getTime());
      const totalNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      this.form.controls.totalNights.setValue(totalNights);
  
      let weekdays = 0;
      let weekends = 0;
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekends++;
        } else {
          weekdays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      console.log('Weekdays:', weekdays);
      console.log('Weekends:', weekends);
    }
  
    this.api.post('reservation/detail', { 'property_id': this.userData.property_id }).subscribe(
      (res: any) => {
        this.rooms = res.data;
      },
      (error: any) => {
        // Handle error if needed
        console.error(error);
      }
    );
  }
  
  isSidebarClosed = false;
  isDarkMode = false;
  darkModeText: string = 'Dark mode';
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  openSidebar() {
    this.isSidebarClosed = false;
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeText = this.isDarkMode ? 'Light mode' : 'Dark mode';

  }
  logout(){
    this.api.post('logout',true).subscribe((res: any) => {
      localStorage.clear();
      this.Router.navigate(['/login']);

    });
  }
open(content:any){
  this.modalService.open(content ,{centered:true})
}
todayDate(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
getDate(){
  console.log(1)
}
onRoomSelect(event: Event) {
  const selectedRoomId = (event.target as HTMLSelectElement).value;
  const selectedRoom = this.rooms.find((room:any) => room.id == selectedRoomId );
  this.selectedRoom = selectedRoom
}
setEndDateMinDate(startDateValue: string): void {
  this.endDateMinDate = startDateValue;
}

onSubmit() {
  console.log(this.form.value)
}

}
