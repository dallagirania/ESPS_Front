import { Utilisateur } from './Utilisateur.model';

export class Notifications{
    constructor(
        public id?:number,
        public subject?:String ,
        public message?:String,
        public CreatedAt?:Date, 
        public idMesure?:number,
        public unseenRecipients:Utilisateur[]=[] ,
        public seenRecipients:Utilisateur[]=[] 
    
    ){
    }
}