import { AfterViewInit, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {RequestService} from '../../services/request.service'
import { AES, enc } from 'crypto-js';
import * as $ from 'jquery'

import 'slick-carousel';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';

interface Image {
  url: string;
  type:string;
  id:number;
}
@Component({
  selector: 'app-rate-plan',
  templateUrl: './rate-plan.component.html',
  styleUrls: ['./rate-plan.component.css']
})
export class RatePlanComponent {
  selectedRooms: any[] = [];
  rateplane:any = FormGroup;
  roomForm:any = FormGroup;
  week_days: string[] = [];
  weekends_price: string[] = [];
  user:any;
  submitted:boolean = false;
  roomDetail:any;
  Rateplans:any;
  selectedAmenities:any = [];
  rateplane_id:any;
  aminites_list:any = [];
  removeImages:any = [];
//   rooms=[
//     {
//     roomId:1,
//     roomNumber:101,
//     roomMainImage:'../../../assets/img/room-1.jpg'
//     },
//     {
//     roomId:2,
//     roomNumber:102,
//     roomMainImage:'../../../assets/img/room-2.jpg'
//     },
//     {
//     roomId:3,
//     roomNumber:103,
//     roomMainImage:'../../../assets/img/room-3.jpg'
//     },
//     {
//     roomId:4,
//     roomNumber:104,
//     roomMainImage:'../../../assets/img/room-4.jpg'
//     },

// ]

constructor(private calendar: NgbCalendar,  private toastService: ToastService, private formBuilder: FormBuilder,public formatter: NgbDateParserFormatter , private modalService: NgbModal,private api:RequestService,private zone: NgZone) {
  this.fromDate = calendar.getToday();
  this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  const user = localStorage.getItem('user');
  this.user = this.decryptUserData(user!);
  this.rateplans();

}
ngOnInit(): void {


  this.rateplane = this.formBuilder.group({

        id:[''],
        season_name:['',Validators.required],
        from:['',Validators.required],
        to:['',Validators.required],
        week_days_price:['',Validators.required],
        week_days:[],
        weekends_price:['',Validators.required],
        weekends_days:[],
        property_id: [parseInt(this.user.property_id), Validators.required]


  });

  this.roomForm = this.formBuilder.group({
    id:[''],
    display_name: ['', Validators.required],
    type: ['', Validators.required],
    size: ['', Validators.required],
    single_bed: ['', Validators.required],
    double_bed: ['', Validators.required],
    maximum_sleeps: ['', Validators.required],
    images: ['', Validators.required],
    room_amenities: ['', Validators.required],
    property_id: [this.user.property_id, Validators.required],
    rate_plan_id: ['', Validators.required],
    removeImage:['']
  });

  const user = localStorage.getItem('user');
  this.user = this.decryptUserData(user!);


}

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





  open(modal:any,rate:any,room:any = false){
    this.modalService.open(modal ,{centered:true})

    if(room == false){
      this.roomDetail = room
      console.log(this.roomDetail)
      this.roomForm.patchValue({
        rate_plan_id:rate
        })
        this.rateplane_id = rate;

      this.aminities();

    }
    else{

      this.roomDetail = room

      this.aminities();
      let img:any =[] ;
      room.image.forEach((element:any) => {
        img.push({url:`https://backend.staybook.pk/public/images/${element.room_image}`,id:element.id,type:'Per'})
      });
      let ami:any = []
      room.amenities.forEach((element:any) => {
        this.aminites_list.push(element.amenity_list.id)
      });
      room.amenities.forEach((element:any) => {
        ami.push({aminitiy_id:element.amenity_list.id})
      });




      this.images = img;
      this.roomForm.patchValue({
        id:room.id,
        display_name: room.display_name,
        type:  room.type,
        size: room.size,
        single_bed:  room.single_bed,
        double_bed:  room.double_bed,
        maximum_sleeps: room.maximum_sleep,

        room_amenities:ami,
        property_id: room.property_setup_id,
        rate_plan_id: room.rate_plan_id
      });

    }

    setTimeout(() => {
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
    }, 10);






  }

  ngAfterViewInit() {


  }


  hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;



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

  submit(){

    this.submitted = true;
    this.rateplane.patchValue({
      from: `${String(this.fromDate?.day).padStart(2, '0')}-${String(this.fromDate?.month).padStart(2, '0')}-${this.fromDate?.year}`,
      to:  `${String(this.toDate?.day).padStart(2, '0')}-${String(this.toDate?.month).padStart(2, '0')}-${this.toDate?.year}`,
      week_days:this.week_days,
      weekends_days:this.weekends_price
    })


    this.api.post('rate_plan/add', this.rateplane.value).subscribe((res: any) => {
      this.showSuccess(res.message);
      this.modalService.dismissAll();
      this.rateplans();
    });

    console.log(this.rateplane.value);
  }

  updateweek_days(day: string): void {
    const index = this.week_days.indexOf(day);

    if (index > -1) {
      // Day is already selected, so remove it from the array
      this.week_days.splice(index, 1);
    } else {
      // Day is not selected, so add it to the array
      this.week_days.push(day);
    }

    console.log(this.week_days);
  }

  updateweekends_price(day: string): void {
    const index = this.weekends_price.indexOf(day);

    if (index > -1) {
      // Day is already selected, so remove it from the array
      this.weekends_price.splice(index, 1);
    } else {
      // Day is not selected, so add it to the array
      this.weekends_price.push(day);
    }

    console.log(this.weekends_price);
  }

  decryptUserData(encryptedData: string): any {
    const decryptedBytes = AES.decrypt(encryptedData, 'encryption-secret-key');
    const decryptedData = JSON.parse(decryptedBytes.toString(enc.Utf8));
    return decryptedData;
  }

rateplans(){
  this.api.post('rate_plan/list', {"property_id":this.user.property_id}).subscribe((res: any) => {
    this.Rateplans = res.data.data;
  });


}

amenity_list: any[] = [];





onFileChange(event: any) {
  for (let i = 0; i < event.target.files.length; i++) {
    const file = event.target.files[i];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      this.images.push({ url: imageUrl,id:i,type:'temp' });
    };
    reader.readAsDataURL(file);
  }
}

removeImage(index: number,id:any) {
  this.removeImages.push({id:id})
  this.images.splice(index, 1);
console.log(this.removeImages);
}
showSuccess(message:any) {
  this.toastService.show(message, { classname: 'bg-success text-light', delay: 10000 });
}
aminities() {
  this.api.post('room/amenities', true).subscribe((res: any) => {
    this.amenity_list = res.data;
  });
}

onCheckboxChange(event: any, list: any) {
  if (event.target.checked) {
    this.selectedAmenities.push({ aminitiy_id: list });
  } else {
    const index = this.selectedAmenities.findIndex((item: any) => item.aminitiy_id === list);
    if (index !== -1) {
      this.selectedAmenities.splice(index, 1);
    }
  }
  const roomAmenities = {
    room_amenities: this.selectedAmenities
  };
  this.roomForm.patchValue(roomAmenities);
}

get f(): { [key: string]: AbstractControl } {
  return this.roomForm.controls;
}

onSubmit() {
  this.submitted = true;
  this.roomForm.patchValue({ images: this.images , removeImage:this.removeImages});

  if (this.roomForm.valid) {

    this.api.post('room/add',this.roomForm.value).subscribe((res: any) => {

   this.showSuccess(res.message);
   this.rateplans();
   this.modalService.dismissAll();
    });
  } else {
 console.log(this.roomForm.value)

  }
}
delete_rateplan(){
  let counter = 5;
  const swalInstance:any = Swal.fire({
    title: 'Are you sure?',
    text: 'Are you sure you want to delete the category? This action will permanently remove all associated rooms.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `Yes, delete it! (${counter})`,
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  });
  swalInstance.d
  const timerInterval = setInterval(() => {
    counter--;
    if (counter === 0) {
      clearInterval(timerInterval);
      swalInstance.enableButtons();
    }
    swalInstance.update({
      confirmButtonText: `Yes, delete it! (${counter})`
    });
  }, 1000);

  swalInstance.then((result:any) => {
    if (result.isConfirmed) {
      // Perform delete action here
      Swal.fire({
        title: 'Deleted!',
        text: 'The category has been deleted.',
        icon: 'success'
      });
    } else {
      clearInterval(timerInterval); // Clear the interval if the user cancels
    }
  });
}
room_delete(room:any){
  let counter = 5;
  const swalInstance:any = Swal.fire({
    title: 'Are you sure?',
    text: `Are you sure you want to delete  ${room.display_name} Room ?  `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `Yes, delete it! (${counter})`,
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  });
  swalInstance.d
  const timerInterval = setInterval(() => {
    counter--;
    if (counter === 0) {
      clearInterval(timerInterval);
      swalInstance.enableButtons();
    }
    swalInstance.update({
      confirmButtonText: `Yes, delete it! (${counter})`
    });
  }, 1000);

  swalInstance.then((result:any) => {
    if (result.isConfirmed) {
      this.api.get('room/delete/'+room.id).subscribe((res: any) => {
      Swal.fire({
        title: 'Deleted!',
        text: `The Room ${room.display_name}  has been deleted.`,
        icon: 'success'
      });
      this.rateplans()
    });
    } else {
      clearInterval(timerInterval); // Clear the interval if the user cancels
    }
  });
}

}
