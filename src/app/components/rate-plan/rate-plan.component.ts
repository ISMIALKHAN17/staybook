import { AfterViewInit, Component } from '@angular/core';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery'
import 'slick-carousel';
interface Image {
  url: string;
}
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





  open(modal:any){
    this.modalService.open(modal ,{centered:true})
    $('.roomMainImage').slick({
      asNavFor: '.roomImages',
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>'
    });
    $('.roomImages').slick({
      asNavFor: '.roomMainImage',
      slidesToShow: 4,
      slidesToScroll: 1,
      prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>'
    });
  }

  ngAfterViewInit() {
    $('.roomMainImage').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode:true,
    prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>'
    });

    
  }


  hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;

	constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter , private modalService: NgbModal) {
		this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}
	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}
	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}
	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}
	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}


  images: Image[] = [];
  hotelForm:any;
  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      this.images.push({ url: imageUrl });
    };
    reader.readAsDataURL(file);
  }
  removeImage(index: number) {
    this.images.splice(index, 1);
  }
}
