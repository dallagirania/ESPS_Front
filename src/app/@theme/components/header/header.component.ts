import { Component, HostListener, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { style } from '@angular/animations';
import { WebSocketService } from '../../../Service/web-socket-service.service';
import { Notifications } from '../../../Model/Notification.model';
import { boolean } from 'mathjs';
import { MesureCC } from '../../../Model/MesureCC.model';
import { ConformiteStyleComponent } from '../../../pages/Controle/conformite-style/conformite-style.component';
import { LocalDataSource } from 'ng2-smart-table';
import { MesureOKD } from '../../../Model/MesureOKD.model';
import { Critere } from '../../../Model/Critere.model';
import { UpdateNotifService } from '../../../Service/update-notif.service';

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
  mesureC=new MesureCC()
  showNotificationList:boolean=false
  sourceMesureCC :LocalDataSource = new LocalDataSource();
  

  mesure= new MesureOKD()
  mesureDetails: { critere: string; valeur: string }[] = [];
  critere= new Critere()
  connect:any 
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private service: CrudService,
              private notificationService: UpdateNotifService, 
              private route:Router,
              private toastrService: NbToastrService,
              private webSocketService: WebSocketService  ,
              private dialogservice: NbDialogService,
            ) {
         

   
  }

  ngOnInit() {
    
    this.currentTheme = this.themeService.currentTheme;
    
    this.connect=localStorage.getItem('mytoken')
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      this.currentuserUnite=this.currentuser.unite.nom  
      //Affichage des notification  
      let stompClient = this.webSocketService.connect();

      stompClient.connect({}, frame => {

        stompClient.subscribe('/topic/notification/' + this.currentuser.matricule, notifications => {
          let notify = JSON.parse(notifications.body);
         
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
          // this.notificationService.unseenCount$.subscribe(count => {
          //    this.nbnotif = count;
          // });
         
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

  navigatetoLogin(){
      this.route.navigate(["/login"])
  }

navigateToProfile() {
  this.route.navigate(["/pages/test/"+this.currentuser.id]);
}
navigateToNotify() {
  this.route.navigate(["/pages/notify/"]);
}

// showNotifications(){
//       this.showNotificationList=true
// }

toggleNotifications(event: MouseEvent) {
  this.showNotificationList = !this.showNotificationList;
  event.stopPropagation(); // Prevent triggering the document click
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  this.showNotificationList = false;
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
       
        this.nbnotif= this.unseenNotifications.length
         
       
      }
    )
  })
 
}
  
markAsSeen(notification: Notifications) {
  if (!notification.seenRecipients.some(user => user.id === this.currentuser.id)) {
      notification.seenRecipients.push(this.currentuser);

    this.service.updateNotify(notification.id, notification).subscribe(
      updatedNotif => {
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
           
            this.nbnotif= this.unseenNotifications.length   
          }
        )
      },
      error => {
        console.error('Error updating notification:', error);
      }
    );
  }
}

OpenDetailCC(dialog: TemplateRef<any>,IdMesure:number) {

    this.service.getMesureCCById(IdMesure).subscribe(mesure=>{
    this.mesureC=mesure
    this.dialogservice.open(dialog);
  })
}
OpenDetailOKD(dialog: TemplateRef<any>,IdMesure:number) {
  this.service.getMesureOKDDetailById(IdMesure).subscribe(mesure=>{
    this.mesure=mesure
    this.extractMesureDetails()
    this.dialogservice.open(dialog);
  })
}

extractMesureDetails() {
  if (this.mesure && this.mesure.val) {
    const critereObservables = [];
    for (const [critereId, valeur] of Object.entries(this.mesure.val)) {
      const critereObservable = this.findCritereName(parseInt(critereId)).pipe(
        map(nomCritere => {
          return { critere: nomCritere, valeur: valeur };
        })
      );
      critereObservables.push(critereObservable);
    }
    forkJoin(critereObservables).subscribe((result: any) => {
      this.mesureDetails = result;
    });
  }
}

findCritereName(critereId: number) {
  return this.service.getCritere().pipe(
    map(criteres => {
      const critere = criteres.find(critere => critere.id === critereId);
      if (critere) {
        if (critere.type === 'valeur') {
          return `${critere.nom} : entre[${critere.min} , ${critere.max}]`;
        } else {
          return `${critere.nom} (Ok/Nok) `;
        }
      } else {
        return undefined;
      }
    })
  );
}


}
