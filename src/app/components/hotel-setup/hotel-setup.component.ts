import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder) { }

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
  ngOnInit(): void {
    this.hotelForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      rooms: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      airportShuttleOptions: this.formBuilder.group({
        free: [false],
        paid: [false],
        airportDropOff: [false],
        airportPickUp: [false]
      }),
      barOptions: this.formBuilder.group({
        hugeBar: [false],
        happyHour: [false],
        miniBar: [false],
        poolBar: [false]
      }),
      freeWifiOptions: this.formBuilder.group({
        freeAllAround: [false],
        freeInPublicAreas: [false],
        paidInRoom: [false],
        freeInRooms: [false]
      }),
      smokingOptions: this.formBuilder.group({
        smokingGalleries: [false],
        notAllowed: [false],
        allowed: [false]
      })
    });
    
}

saveForm() {
  if (this.hotelForm.valid) {
    console.log(this.hotelForm.value);
  } else {
    console.log('Form is invalid');
  }
}

}
