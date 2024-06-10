import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentuser:any
  role:any
  constructor(
    private router: Router,
    private toastrService: NbToastrService,
    private service: CrudService,
  ) { }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var isAuthenticated = !!localStorage.getItem("mytoken");
   
      // if (!isAuthenticated) {
      //   this.router.navigate(['/login']);
      //   this.toastrService.success("You have to login to access this page", {
      //     duration: 5000,
      //       });
        
      // }
      // return isAuthenticated;

      if (isAuthenticated && route.routeConfig.path != "home") {

        const role = localStorage.getItem("user");
  
        switch (route.routeConfig.path) {
  
          case "dashboard": return role == "MOD"  ? true : role == "RPS" ?  true : role == "RPUO" ? true : role == "Qualiticien" ? true: role == "AEF" ? true:role == "Methodiste" ? true:false;
          case "home": return role == "MOD"  ? true : role == "RPS" ?  true : role == "RPUO" ? true : role == "Qualiticien" ? true: role == "AEF" ? true:role == "Methodiste" ? true:false;
          case "notify": return role == "MOD"  ? true : role == "RPS" ?  true : role == "RPUO" ? true : role == "Qualiticien" ? true: role == "AEF" ? true:role == "Methodiste" ? true:false;
         
          case "ParametrageSite": return role == "RPS" ? true: false;
          case "ParametrageRUO": return role == "RPS" ? true:role == "RPUO" ? true: false;

          case "ListProcede": return role == "RPUO" ? true:role == "Methodiste" ? true: false;
          
          case "Verif": return role == "Qualiticien" ? true: false;

          case "ListeHabilitation": return role == "AEF" ? true:role == "RPUO" ? true: false;
         
        }
  
        return true;
  
      }else{
        return true;  
      }


  
      // not logged in so redirect to login page with the return url
  
      this.router.navigate(['/login']);
      this.toastrService.success("You have to login to access this page", {duration: 5000,});
      return false;
  }
  
  
}
