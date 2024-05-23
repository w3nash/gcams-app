import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error!: string;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/' + this.loginService.getRole()]);
      return;
    }
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@gordoncollege\\.edu\\.ph$'),
        ],
      ],
      password: ['', Validators.required],
    });
    this.error = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password).subscribe(
      (data) => {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('role', data.data.role);
        this.router.navigate(['/' + data.data.role]);
      },
      (error) => {
        this.error = error?.error?.message;
        console.log(error);
      }
    );
  }
}
