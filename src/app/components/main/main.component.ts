import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(

    private api: RequestService,
    private Router:Router

  ) {}
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
}
