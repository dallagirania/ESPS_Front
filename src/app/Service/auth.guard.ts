import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastrService: NbToastrService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var isAuthenticated = !!localStorage.getItem("mytoken");
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        this.toastrService.success("You have to login to access this page", {
          duration: 5000,
            });
        
      }
      return isAuthenticated;
  }
  
  
}
