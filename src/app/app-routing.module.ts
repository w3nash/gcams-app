import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentEditComponent } from './student/student-edit/student-edit.component';
import { StudentClassComponent } from './student/student-class/student-class.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { InstructorDashboardComponent } from './instructor/instructor-dashboard/instructor-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'student',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: StudentDashboardComponent,
      },
      {
        path: 'edit',
        component: StudentEditComponent,
      },
      {
        path: 'class/:class_code',
        component: StudentClassComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'instructor',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: InstructorDashboardComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
