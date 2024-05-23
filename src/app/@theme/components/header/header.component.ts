import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { style } from '@angular/animations';
import { WebSocketService } from '../../../Service/web-socket-service.service';
import { Notifications } from '../../../Model/Notification.model';
import { boolean } from 'mathjs';

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
    { title: 'Profile', action: 'navigateToProfile()', icon: 'person-outline'},
    { title: 'Déconnecter', action: 'logOut()', icon: 'log-out-outline'},
  
  ];
  
  
  currentuser:any
  currentuserUnite:any
  listenotif:Notifications[]=[]
  unseenNotifications:Notifications[]=[]
  seenNotifications:Notifications[]=[]
  nbnotif:number
  showNotificationList:boolean=false
  
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private service: CrudService,
              private route:Router,
              private toastrService: NbToastrService,
              private webSocketService: WebSocketService  
            ) {
         

   
  }

  ngOnInit() {
    
    this.currentTheme = this.themeService.currentTheme;

    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      this.currentuserUnite=this.currentuser.unite.nom

      console.log("Info header  :",this.currentuser ) 
      console.log("Info currentuserUnite  :",this.currentuserUnite )   
          
      //Affichage des notification  
      let stompClient = this.webSocketService.connect();

      stompClient.connect({}, frame => {

        stompClient.subscribe('/topic/notification/' + this.currentuser.matricule, notifications => {
          let notify = JSON.parse(notifications.body);
          console.log("la notif reçue est :",notify)
          this.toastrService.warning("vous avez une non conformité ", 'Warning');
          this.LoadNotification()
        });

        this.webSocketService.connected = true;

      }); 

      this.service.getNotificationByMatricule(this.currentuser.matricule).subscribe(
        savednotif=>{
          this.listenotif=savednotif;
         //filtrer les notifications unseenNotifications : 
          for (let notif of this.listenotif) {
            if (notif.seenRecipients.some(user => user.id === this.currentuser.id)) {
              this.seenNotifications.push(notif);
            } else {
              this.unseenNotifications.push(notif);
            }
          }
          this.nbnotif= this.unseenNotifications.length
            console.log("nbnotif :==>",this.nbnotif)
    
         
        }
      )
  })

  // this.LoadNotification()
 

  /************************************************************************* */
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
    localStorage.clear()
    this.route.navigate(["/login"])

  }
  
navigateToProfile() {
  this.route.navigate(["/pages/test/"+this.currentuser.id]);
}
navigateToNotify() {
  this.route.navigate(["/pages/notify/"]);
}

showNotifications(){
  if( this.showNotificationList==true)
    {
      this.showNotificationList=false
    }
    else{
      this.showNotificationList=true
    }
  
}

LoadNotification(){
  this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
    this.currentuser=utilisateur
    this.service.getNotificationByMatricule(this.currentuser.matricule).subscribe(
      savednotif=>{
        this.listenotif=savednotif;
        this.seenNotifications =[];
        this.unseenNotifications=[];
       //filtrer les notifications unseenNotifications : 
        for (let notif of this.listenotif) {
          if (notif.seenRecipients.some(user => user.id === this.currentuser.id)) {
            this.seenNotifications.push(notif);
          } else {
            this.unseenNotifications.push(notif);
          }
        }
        console.log("this.unseenNotifications",this.unseenNotifications)
        this.nbnotif= this.unseenNotifications.length
          console.log("nbnotif :==>",this.nbnotif)
  
       
      }
    )
  })
 
}
  
markAsSeen(notification: Notifications) {
  if (!notification.seenRecipients.some(user => user.id === this.currentuser.id)) {
      notification.seenRecipients.push(this.currentuser);

    this.service.updateNotify(notification.id, notification).subscribe(
      updatedNotif => {
        console.log('Notification updated successfully:', updatedNotif);
      //  this.updateNotificationLists(updatedNotif);
       // this.LoadNotification()
        this.service.getNotificationByMatricule(this.currentuser.matricule).subscribe(
          savednotif=>{
                        this.listenotif=savednotif;
           //filtrer les notifications unseenNotifications :
           this.seenNotifications =[];
           this.unseenNotifications=[];
            for (let notif of this.listenotif) {
              if (notif.seenRecipients.some(user => user.id === this.currentuser.id)) {
                this.seenNotifications.push(notif);
              } else {
                this.unseenNotifications.push(notif);
              }
            }
            console.log("this.unseenNotifications",this.unseenNotifications)
            this.nbnotif= this.unseenNotifications.length
              console.log("nbnotif :==>",this.nbnotif)
      
           
          }
        )
      },
      error => {
        console.error('Error updating notification:', error);
      }
    );
  }
}
updateNotificationLists(notification: Notifications) {
  // Retirer la notification de unseenNotifications
  const unseenIndex = this.unseenNotifications.findIndex(notif => notif.id === notification.id);
  if (unseenIndex !== -1) {
    this.unseenNotifications.splice(unseenIndex, 1);
  }

  // Ajouter la notification à seenNotifications
  this.seenNotifications.push(notification);

  // Actualiser le nombre de notifications non vues
  this.nbnotif = this.unseenNotifications.length;
}
}
