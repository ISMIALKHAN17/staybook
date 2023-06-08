import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import {RequestService} from '../../services/request.service'
import { AES,enc } from 'crypto-js';
import { ToastService } from 'src/app/services/toast.service';
interface Image {
  url: string;
  id: any;
  type:string
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
  user:any;
  aminites_list :any = [];
  removeimages:any = [];
  loading:any = false
  btnLoading:any = false
  constructor(private formBuilder: FormBuilder,private api:RequestService, private toastService: ToastService) { }

  onFileChange(event: any) {
    for(let i = 0; i< event.target.files.length;i++){
    const file = event.target.files[i];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      console.log(e);
      const imageUrl = e.target.result;
      this.images.push({ url: imageUrl ,id:i,type:"temp"});

      console.log( this.images);
    };

    reader.readAsDataURL(file);
  }
  }
  removeImage(index: number,img:any) {
    this.images.splice(index, 1);
    if(img.type == 'Per'){
      this.removeimages.push({"id":img.id});
    }
    this.hotelForm.patchValue({removeImage: this.removeimages});
    console.log(this.removeimages)
  }
  ngOnInit(): void {
    const  user = localStorage.getItem('user')
    this.user = this.decryptUserData(user!)

    console.log(this.user)

    this.aminities();
    this.states();
    this.get_hotel();
    this.hotelForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      rooms: ['', Validators.required],
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      postol_code: ['', Validators.required],
      hotel_amenities: [''],
      images:[''],
      user_id:this.user.id,
      removeImage:[]

    });

}

showSuccess(message:any) {
  this.toastService.show(message, { classname: 'bg-success text-light', delay: 10000 });
}
saveForm() {
  this.submitted = true;
  this.hotelForm.patchValue({images:this.images})
  if (this.hotelForm.valid) {
    this.btnLoading = true
    this.api.post('property/store',this.hotelForm.value).subscribe((res:any)=>{
      const resID = res.data.user.property_id
      const user:any = localStorage.getItem('user')
      const userDec = this.decryptUserData(user)
      if(resID != userDec.property_id ){
        const encryptedUser = this.encryptUserData(res.data.user);
        localStorage.setItem('user', encryptedUser);
      }
      this.showSuccess(res.message);
      this.btnLoading = false
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

  this.api.post('city/list',{"state_id":id}).subscribe((res:any)=>{
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

get_hotel(){
  this.loading = true
  this.api.post('property/list',{"user_id":this.user.id}).subscribe((res:any)=>{

 this.loading = false
      const hotel = res.data;

      var  aminities:any = [];

    hotel.property_amenity.forEach((element:any) => {
      aminities.push(element.amenity_list_id)
    });

    hotel.image.forEach((element:any) => {
      this.images.push({"url": element.image, "id": element.id,type:"Per"})
    });


    this.aminites_list = aminities.map(Number);


    this.cities(hotel.state_id)
    this.hotelForm.patchValue({
      name: hotel.name,
      id: hotel.id,
      email: hotel.email,
      contact: hotel.contact,
      rooms: hotel.rooms,
      address_line_1: hotel.address_line_1,
      address_line_2: hotel.address_line_2,
      country_id: hotel.country_id,
      state_id: hotel.state_id,
      city_id: hotel.city_id,
      postol_code: hotel.postol_code,
    })
 });

}

decryptUserData(encryptedData: string): any {
  const decryptedBytes = AES.decrypt(encryptedData, 'encryption-secret-key');
  const decryptedData = JSON.parse(decryptedBytes.toString(enc.Utf8));
  return decryptedData;
}
encryptUserData(user: any): string {
  const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
  return encryptedData;
}
}
