import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { LoginComponent } from './Authentification/login/LoginComponent';
import { AuthGuard } from './Service/auth.guard';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'pages',
    canActivate:[AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  
   {
    path: 'auth',
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  }, 
  { path: '', redirectTo: 'pages', pathMatch: 'full'},
  { path: '**', redirectTo: 'pages'},

];

const config: ExtraOptions = {
  useHash: false,
};
/*canActivate:[AuthGuard]*/
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  providers: [AuthGuard],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
