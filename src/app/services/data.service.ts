import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, Instructor, Admin } from './User';
import { LoginService } from './login.service';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private loginService: LoginService) {}

  getStudent(): Observable<Student> {
    return this.http.get<{ data: Student }>('protected').pipe(
      map((response: { data: any }) => response.data.data),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );
  }

  getInstructor(): Observable<Instructor> {
    return this.http.get<{ data: Instructor }>('protected').pipe(
      map((response: { data: any }) => response.data.data),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        this.loginService.logout();
        return throwError(error);
      })
    );
  }

  getAdmin(): Observable<Admin> {
    return this.http.get<{ data: Admin }>('protected').pipe(
      map((response: { data: any }) => response.data.data),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        this.loginService.logout();
        return throwError(error);
      })
    );
  }

  getStudentClasses(student_id: string): Observable<any> {
    return this.http
      .get<{ data: any }>('student/classes?student_id=' + student_id)
      .pipe(
        map((response: { data: any }) => response.data),
        catchError((error) => {
          console.error('Error fetching student class:', error);
          this.loginService.logout();
          return throwError(error);
        })
      );
  }
}
