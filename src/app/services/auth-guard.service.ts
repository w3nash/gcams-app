import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  canActivate(): Promise<boolean | UrlTree> {
    if (this.loginService.isLoggedIn()) {
      const role = this.loginService.getRole();
      return this.router.navigate(['/' + role]);
    }
    return Promise.resolve(false);
  }
}
