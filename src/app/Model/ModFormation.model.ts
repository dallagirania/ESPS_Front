import { Files } from './Files.model';
import { Formation } from './Formation.model';


export class ModFormation{
    constructor(
        public id?:number,
        public date_init?:String ,
        public date_fin?:String ,
        public qualit_id?:number,
        public formation?:Formation, 
        public etatactive?:Boolean, 
        public files:Files[]=[]  
    ){
    }
}