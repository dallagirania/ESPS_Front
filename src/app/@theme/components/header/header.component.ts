import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';

@Component({  
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
      // sun-outline
    },
    {
      value: 'dark',
      name: 'Dark',
      // moon-outline
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  //userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];
  userMenu = [
    { title: 'Profile', action: 'navigateToProfile()', icon: 'person-outline' },
    { title: 'Déconnecter', action: 'logOut()', icon: 'log-out-outline' },
  
  ];
  
  
  currentuser:any
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private service: CrudService,
              private route:Router,) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      console.log("Info header  :",this.currentuser )    
  })

  this.menuService.onItemClick().subscribe((event) => {

    if (event.item.title === 'Déconnecter') {

      this.logOut();

    }

    if (event.item.title === 'Profile') {

      this.navigateToProfile();

    }



  });
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  logOut(){
    
    console.log("teeee")
    localStorage.clear()
    this.route.navigate(["/login"])

  }
  
navigateToProfile() {
  this.route.navigate(["/pages/test/"+this.currentuser.id]);
}
// performAction(action: string) {
//   switch (action) {
//     case 'logOut':
//       this.logOut();
//       break;
//     case 'navigateToProfile':
//       this.navigateToProfile();
//       break;
//     default:
//       break;
//   }
// }
}
