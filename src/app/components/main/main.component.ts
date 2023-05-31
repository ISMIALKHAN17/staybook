import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
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
    // Add logic to apply dark mode styles or make necessary changes in your application
    // For example, you can update the body class to apply dark mode styles:
    // document.body.classList.toggle('dark');
  }
}
