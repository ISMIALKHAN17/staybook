import { Component } from '@angular/core';
import { trigger, transition, style, animate, state, animateChild, query } from '@angular/animations';
import { interval } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slideFade', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
    query('@*', animateChild(), { optional: true })
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'scale(1)' }),
    animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.8)' })),
    query('@*', animateChild(), { optional: true })
  ])
    ])
  ],
})
export class LoginComponent {
    screen = 'login'
    trigerScreen:any 
    timer: number = 30;
    showForgotPassword: boolean = false;
  changeScreen(screen :any) {
    this.screen = '';
    this.showForgotPassword = true
    this.trigerScreen= screen
  }
  onAnimationDone(event: any) {
    if (event.toState === 'void') {
      this.screen = this.trigerScreen
      // Animation is completed and element is removed
      // You can perform any additional logic here
    }
  }

  startTimer() {
    const source = interval(1000); // Emit a value every second
    const subscription = source.subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        subscription.unsubscribe(); // Stop the timer when it reaches 0
      }
    });
  }
}
