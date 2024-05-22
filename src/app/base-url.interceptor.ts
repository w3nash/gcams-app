import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { LoginService } from './services/login.service';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl: string = 'http://localhost/api';

  constructor(private loginService: LoginService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.loginService.getToken();
    if (!authToken) {
      const apiReq = request.clone({
        url: `${this.baseUrl}/${request.url}`,
      });
      return next.handle(apiReq);
    }
    const apiReq = request.clone({
      url: `${this.baseUrl}/${request.url}`,
      headers: request.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next.handle(apiReq);
  }
}
