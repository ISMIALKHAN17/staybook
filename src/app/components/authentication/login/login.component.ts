import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, transition, style, animate, state, animateChild, query } from '@angular/animations';
import { interval } from 'rxjs';
import { AbstractControl, EmailValidator, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { AES } from 'crypto-js';
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
  @Output() loggedIn: EventEmitter<void> = new EventEmitter<void>();
  screen = 'login';
  trigerScreen: any;
  timer: number = 30;
  showForgotPassword: boolean = false;
  loginForm: any;
  loading: any = false;
  forgotForm:any
  responseData:any
  resendDisabled:any = true
  otpPassword:any
  passwordForm:any

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public toastService: ToastService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgotForm = this.formBuilder.group({
      email: new FormControl('',[Validators.required ,Validators.email])
    });

    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.loading = false;
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.loading = true;
      this.authService.login(username, password).subscribe(
        (res: any) => {
          this.loading = false;
          localStorage.setItem('bearer_token',res.authorisation.token)
          const encryptedUser = this.encryptUserData(res.user);
          localStorage.setItem('user', encryptedUser);
          this.showSuccess(`Welcome, ${res.user.name}! Login successful.`);
          this.loggedIn.emit();
          localStorage.setItem('authantication',this.encryptUserData('approved'))
        },
        (error: any) => {
          this.loading = false;
          if(error.status == 400){
            this.showDanger('Invalid Username or Password');
          }else{
            this.showDanger('There is some error');
          }
        }
      );
    }
  }

  changeScreen(screen: any) {
    this.screen = '';
    this.showForgotPassword = true;
    this.trigerScreen = screen;
  }

  onAnimationDone(event: any) {
    if (event.toState === 'void') {
      this.screen = this.trigerScreen;
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
        subscription.unsubscribe();
        this.resendDisabled = false // Stop the timer when it reaches 0
      }
    });
  }

  showStandard() {
    this.toastService.show('I am a standard toast');
  }

  showSuccess(message:any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 10000 });
  }

  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  forgotPassword(){
    if(this.forgotForm.valid){
      this.loading = true
      this.authService.forgotPassword(this.forgotForm.value.email).subscribe(
        (res:any)=>
        {
          if(res.data != null){
            this.changeScreen('reset-your-password')
            this.loading = false
            this.responseData = res.data
            console.log(this.responseData)
            this.loading = false
          }
          else{
            this.showDanger('Account not found!')
            this.loading = false
          }
      },
      (error:any)=>{
        this.showDanger('Opps serve error please try again later !')
        this.loading = false
      }
      )
    }
  }
  forgotSendMail() {
    this.loading = true
    const selectedOption = document.querySelector('input[name="r"]:checked');
    if (selectedOption) {
      const value = selectedOption.getAttribute('value');
      if (value === '1') {
        this.authService.forgotSendMail(this.responseData.email).subscribe(
          (res:any)=>
          {
          this.changeScreen('email-otp')
          this.loading = false
          this.showSuccess('Please check your email inbox')
          this.startTimer()
        },
        (error:any)=>{
          this.showDanger('Opps serve error please try again later !')
          this.loading = false
        }
        )
      } else if (value === '2') {
        this.showDanger('You can only use email to reset password')
        this.loading = false
      }
    }
  }
  resendEmail(){
    this.authService.forgotPassword(this.responseData.email).subscribe(
      (res:any)=>
      {
      this.changeScreen('email-otp')
      this.loading = false
      this.showSuccess('Please check your email inbox')
      this.timer = 120
      this.startTimer()
    },
    (error:any)=>{
      this.showDanger('Opps serve error please try again later !')
      this.loading = false
    }
    )
  }

  verifyEmail(){
    this.loading = true
    this.authService.emailOTP(this.responseData.email,this.otpPassword).subscribe(
      (res:any)=>
      {
        if(res.data != "Worng Code!"){
          this.changeScreen('new-password')
          this.loading = false
          this.showSuccess('Email Verified !')
        }else{
          this.showDanger('Invaild Code!')
          this.loading = false
        }
    },
    (error:any)=>{
      this.showDanger('Opps serve error please try again later !')
      this.loading = false
    }
    )
  }
  maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 3) + '*'.repeat(username.length - 3);
    return maskedUsername + '@' + domain;
  }
  maskPhoneNumber(phoneNumber: string): string {
    const maskedPhoneNumber = '*'.repeat(phoneNumber.length - 3) + phoneNumber.slice(-3);
    return maskedPhoneNumber;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null; // Passwords match
    } else {
      return { passwordMismatch: true }; // Passwords don't match
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password;
      this.authService.newPassword(this.responseData.email,password).subscribe(
        (res:any)=>
        {
            this.changeScreen('Verified')
            this.loading = false
            this.showSuccess('Password changed sucessfully !')
      },
      (error:any)=>{
        this.showDanger('Opps serve error please try again later !')
        this.loading = false
      }
      )
    }
  }


  encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }
}
