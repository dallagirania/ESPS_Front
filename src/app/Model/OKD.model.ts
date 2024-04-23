import { Procede } from './Procede.model';

export class OKD{
    constructor(
        public id?:number,
        public nom?:String ,
        public ref?:String ,
        public designation?:String,
        public date_init?:string ,
        public etatactive?:Boolean,  
        public procede?:Procede, 
  
    ){
    }
}