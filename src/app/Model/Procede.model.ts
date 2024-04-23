import { Atelier } from './Atelier.model';
import { Files } from './Files.model';

export class Procede{
    constructor(
        public id?:number,
        public nom?:String ,
        public ref?:String ,
        public rev?:String ,
        public code?:String ,
        public designation?:String,
        public etat?:string,
        public nb_critere?:number,
        public date_init?:string ,
        public date_fin?:string  ,
        public att1?:string ,
        public att2?:string  ,   
        public image?:String,
        public atelier?:Atelier, 
        public etatactive?:Boolean, 
        public files:Files[]=[]  
        
       
       

    ){
    }
}