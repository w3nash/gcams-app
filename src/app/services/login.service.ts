import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`login`, body);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    // Set token to expire in 24 hours
    const now = new Date();
    now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
    localStorage.setItem('expire_at', now.getTime().toString());
  }

  setRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken() {
    const expireAt = localStorage.getItem('expire_at');
    if (expireAt && new Date().getTime() > Number(expireAt)) {
      // Token expired
      this.logout();
      return null;
    }
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    // Clear token and expiration time from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expire_at');
  }
}
