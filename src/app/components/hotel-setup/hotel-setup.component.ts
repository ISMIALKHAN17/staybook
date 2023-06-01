import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import {RequestService} from '../../services/request.service'
interface Image {
  url: string;
}
@Component({
  selector: 'app-hotel-setup',
  templateUrl: './hotel-setup.component.html',
  styleUrls: ['./hotel-setup.component.css']
})
export class HotelSetupComponent {
  images: Image[] = [];
  hotelForm:any;
  amenity_list:any;
  selectedAmenities: any[] = [];
  submitted:boolean = false;
  states_list:any;
  cities_list:any;
  constructor(private formBuilder: FormBuilder,private api:RequestService) { }

  onFileChange(event: any) {
    for(let i = 0; i< event.target.files.length;i++){
    const file = event.target.files[i];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      this.images.push({ url: imageUrl });
    };

    reader.readAsDataURL(file);
  }
  }
  removeImage(index: number) {
    this.images.splice(index, 1);
  }
  ngOnInit(): void {
    this.aminities();
    this.states();
    this.hotelForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      rooms: ['', Validators.required],
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      postalCode: ['', Validators.required],
      hotel_amenities: [''],
      images:[''],
      user_id:'1'

    });

}

saveForm() {
  this.submitted = true;
  this.hotelForm.patchValue({images:this.images})
  if (this.hotelForm.valid) {
    this.api.post('property/store',this.hotelForm.value).subscribe((res:any)=>{
      this.amenity_list = res.data;
   });
  } else {
    console.log('Form is invalid');
    console.log(this.hotelForm.value);



  }
}

aminities(){
  this.api.post('amenity/list',true).subscribe((res:any)=>{
   this.amenity_list = res.data;
});
}
states(){
  this.api.post('state/list',{"country_id":2}).subscribe((res:any)=>{
   this.states_list = res.data;
});
}
cities(id:any){
  console.log(id.value);
  this.api.post('city/list',{"state_id":id.value}).subscribe((res:any)=>{
   this.cities_list = res.data;
});
}

onCheckboxChange(event: any, list: any) {
  if (event.target.checked) {
    this.selectedAmenities.push({ "aminitiy_id" : list});
  } else {

    const index = this.selectedAmenities.findIndex((item) => item.aminitiy_id === list);


    if (index !== -1) {
      this.selectedAmenities.splice(index, 1);
    }
  }



  const hotelAmenities = {
    hotel_amenities: this.selectedAmenities
  };


  this.hotelForm.patchValue(hotelAmenities);


}

get f(): { [key: string]: AbstractControl } {
  return this.hotelForm.controls;
}


}
