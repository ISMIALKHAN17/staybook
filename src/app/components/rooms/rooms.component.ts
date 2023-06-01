import { Component } from '@angular/core';
interface Image {
  url: string;
}
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
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
