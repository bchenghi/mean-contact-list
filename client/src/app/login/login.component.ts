import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  wasSubmitted: boolean = false;
  loginErrorMsg: string = '';

  loginForm : FormGroup=new FormGroup({
    email: new FormControl(null,[Validators.email,Validators.required]),
    password: new FormControl(null, Validators.required)
  });
  constructor(private router:Router, private userService:UserService) { }

  ngOnInit() {
  }

  moveToRegister(){
    this.router.navigate(['/register']);
  }

  login(){
    this.wasSubmitted = true;

    if(!this.loginForm.valid){
      console.log('Invalid');
      return;
    }

    // console.log(JSON.stringify(this.loginForm.value));
    this.userService.login(JSON.stringify(this.loginForm.value))
    .subscribe(
      data => this.router.navigate(['/contacts']),
      error => {
        this.loginErrorMsg = "Username or password incorrect"
      }
    )
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

}
