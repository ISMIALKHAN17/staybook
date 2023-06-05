import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { AES, enc } from 'crypto-js';

interface Image {
  url: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  amenity_list: any[] = [];
  roomForm:any  = FormGroup;
  user: any;
  selectedAmenities: any[] = [];
  submitted: boolean = false;
  images: Image[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private api: RequestService,
    private toastService: ToastService
  ) {
    this.aminities();
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = this.decryptUserData(user!);

    this.roomForm = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: ['', Validators.required],
      size: ['', Validators.required],
      single_bed: ['', Validators.required],
      double_bed: ['', Validators.required],
      maximum_sleeps: ['', Validators.required],
      images: ['', Validators.required],
      room_amenities: ['', Validators.required],
      property_id: [this.user.property_id, Validators.required]
    });
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
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
    this.roomForm.patchValue({ images: this.images });
    if (this.roomForm.valid) {
      console.log(this.roomForm.value);
      this.api.post('room/add', this.roomForm.value).subscribe((res: any) => {
     console.log(res.data);
     this.showSuccess(res.message);
      });
    } else {
   console.log(this.roomForm.value)
   console.log(this.user)
    }
  }

  decryptUserData(encryptedData: string): any {
    const decryptedBytes = AES.decrypt(encryptedData, 'encryption-secret-key');
    const decryptedData = JSON.parse(decryptedBytes.toString(enc.Utf8));
    return decryptedData;
  }
}
