import { AfterViewInit, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery'
import 'slick-carousel';
@Component({
  selector: 'app-rate-plan',
  templateUrl: './rate-plan.component.html',
  styleUrls: ['./rate-plan.component.css']
})
export class RatePlanComponent {

  selectedRooms: any[] = [];
  
  rooms=[
    {
    roomId:1,
    roomNumber:101,
    roomMainImage:'../../../assets/img/room-1.jpg'
    },
    {
    roomId:2,
    roomNumber:102,
    roomMainImage:'../../../assets/img/room-2.jpg'
    },
    {
    roomId:3,
    roomNumber:103,
    roomMainImage:'../../../assets/img/room-3.jpg'
    },
    {
    roomId:4,
    roomNumber:104,
    roomMainImage:'../../../assets/img/room-4.jpg'
    },
    {
    roomId:5,
    roomNumber:105,
    roomMainImage:'../../../assets/img/room-5.jpg'
    },
]

toggleRoomSelection(room: any) {
  if (this.isRoomSelected(room)) {
    // Room is already selected, so remove it from the selectedRooms array
    this.selectedRooms = this.selectedRooms.filter((selectedRoom:any) => selectedRoom !== room);
  } else {
    // Room is not selected, so add it to the selectedRooms array
    this.selectedRooms.push(room);
  }
}

isRoomSelected(room: any) {
  return this.selectedRooms.includes(room);
}


  constructor(private modalService: NgbModal) { }



  open(modal:any){
    this.modalService.open(modal ,{centered:true})
  }

  ngAfterViewInit() {
    $('.rate_plan_rooms_slider').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode:true,
    prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>'
    });
  }
}
