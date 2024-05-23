import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.loginService.isLoggedIn()) {
      const role = this.loginService.getRole();
      const currentRoute = state.url;
      if (role != 'admin' && currentRoute.includes('admin')) {
        return this.router.navigate(['/' + role]);
      } else if (role != 'student' && currentRoute.includes('student')) {
        return this.router.navigate(['/' + role]);
      } else if (role != 'instructor' && currentRoute.includes('instructor')) {
        return this.router.navigate(['/' + role]);
      }
    }
    return this.router.navigate(['/login']);
  }
}
