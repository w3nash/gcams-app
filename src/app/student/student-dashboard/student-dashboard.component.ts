import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Student } from '../../services/User';
import { DataService } from '../../services/data.service';
import { Class } from './Class';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent implements OnInit {
  user!: Student;
  myClasses!: Class[];

  constructor(
    private loginService: LoginService,
    private dataService: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const student = await this.dataService.getStudent().toPromise();
      if (student) {
        this.user = student;
      } else {
        console.error('No student data found');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }

    try {
      this.myClasses = await this.dataService
        .getStudentClasses(this.user.student_id)
        .toPromise();
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  logout() {
    this.loginService.logout();
  }
}
