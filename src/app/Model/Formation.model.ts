import { Files } from './Files.model';
import { Habilitation } from './Habilitation.model';
import { ModFormation } from './ModFormation.model';
import { Utilisateur } from './Utilisateur.model';

export class Formation{
    constructor(
        public id?:number,
        public date_init?:String ,
        public date_fin?:String ,
        public qualit_id?:number,
        public habilitation?:Habilitation, 
        public utilisateur?:Utilisateur, 
        public etatactive?:Boolean, 
        public files:Files[]=[],  
        public modFormation:ModFormation[]=[] 
    ){
    }
}