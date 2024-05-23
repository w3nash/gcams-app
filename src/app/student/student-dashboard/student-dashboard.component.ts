import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  constructor(private loginService: LoginService) {}
  logout() {
    this.loginService.logout();
  }
  myClasses = [
    {
      name: 'Class 1',
      classCode: 'Code 1',
      time: '7:00 AM - 10:00 AM',
      roomNo: '510',
    },
    {
      name: 'Class 2',
      classCode: 'Code 2',
      time: '7:00 AM - 10:00 AM',
      roomNo: '510',
    },
    {
      name: 'Class 3',
      classCode: 'Code 3',
      time: '7:00 AM - 10:00 AM',
      roomNo: '510',
    },
    {
      name: 'Class 4',
      classCode: 'Code 4',
      time: '7:00 AM - 10:00 AM',
      roomNo: '510',
    },
    {
      name: 'Class 5',
      classCode: 'Code 5',
      time: '7:00 AM - 10:00 AM',
      roomNo: '510',
    },
  ];
}
