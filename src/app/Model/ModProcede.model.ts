import { Files } from './Files.model';
import { Procede } from './Procede.model';


export class ModProcede{
    constructor(
        public id?:number,
        public date_init?:String ,
        public date_fin?:String ,
        public nom?:String,
        public ref?:String ,
        public rev?:String ,
        public code?:String,
        public designation?:String,
        public procede?:Procede, 
        public etatactive?:Boolean, 
        public files:Files[]=[]  
    ){
    }
}