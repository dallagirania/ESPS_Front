import { Component, OnInit } from '@angular/core';
import { Notifications } from '../../../Model/Notification.model';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../Service/web-socket-service.service';

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
  showNotificationList:boolean=false
  
  constructor(
    private sidebarService: NbSidebarService,
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
  ngOnInit(): void {  
    
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      console.log("Info header  :",this.currentuser ) 
      console.log("Info matricule  :",this.currentuser.matricule )   
          
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

}
