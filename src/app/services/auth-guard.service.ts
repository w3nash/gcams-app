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
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.loginService.isLoggedIn()) {
      const role = this.loginService.getRole();
      const currentRoute = state.url;

      if (role !== 'admin' && currentRoute.includes('admin')) {
        await this.router.navigate(['/' + role]);
        return false;
      } else if (role !== 'student' && currentRoute.includes('student')) {
        await this.router.navigate(['/' + role]);
        return false;
      } else if (role !== 'instructor' && currentRoute.includes('instructor')) {
        await this.router.navigate(['/' + role]);
        return false;
      }
      return true;
    }
    await this.router.navigate(['/login']);
    return false;
  }
}
