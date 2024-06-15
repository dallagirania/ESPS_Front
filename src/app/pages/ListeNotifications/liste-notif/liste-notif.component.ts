import { Component, OnInit, TemplateRef } from '@angular/core';
import { Notifications } from '../../../Model/Notification.model';
import { NbDialogService, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../Service/web-socket-service.service';
import { MesureOKD } from '../../../Model/MesureOKD.model';
import { Critere } from '../../../Model/Critere.model';
import { Subject, forkJoin } from 'rxjs';
import { MesureCC } from '../../../Model/MesureCC.model';
import { map, takeUntil } from 'rxjs/operators';
import { UpdateNotifService } from '../../../Service/update-notif.service';

@Component({
  selector: 'ngx-liste-notif',
  templateUrl: './liste-notif.component.html',
  styleUrls: ['./liste-notif.component.scss']
})
export class ListeNotifComponent implements OnInit {
  currentuser:any

  listenotif:Notifications[]=[]
  unseenNotifications:Notifications[]=[]
  seenNotifications:Notifications[]=[]
  nbnotif:number
  seennotif:number
  page :number=1
  showNotificationList:boolean=false
  mesureC=new MesureCC() 
  mesure= new MesureOKD()
  mesureDetails: { critere: string; valeur: string }[] = [];
  critere= new Critere()

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private service: CrudService,
    private notificationService: UpdateNotifService, 
    private route:Router,
    private toastrService: NbToastrService,
    private webSocketService: WebSocketService,
    private dialogservice: NbDialogService  
            ) {
         

   
  }
  ngOnInit(): void {  
    
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
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
          this.seennotif= this.seenNotifications.length 
    
         
        }
      )
  })}

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
            this.seennotif= this.seenNotifications.length 
         
        }
      )
    })
   
  }
    
  markAsSeen(notification: Notifications) {
    if (!notification.seenRecipients.some(user => user.id === this.currentuser.id)) {
        notification.seenRecipients.push(this.currentuser);
      

        this.service.updateNotify(notification.id, notification).subscribe(
        updatedNotif => {
          this.service.getNotificationByMatricule(this.currentuser.matricule).subscribe(savednotif=>{
             this.listenotif=savednotif;
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
                this.seennotif= this.seenNotifications.length 
                this.notificationService.updateNotifications(savednotif);
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
