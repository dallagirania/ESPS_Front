import { Procede } from './Procede.model';

export class Habilitation{
    constructor(
        public id?:number,
        public titre?:String ,
        public ref?:String ,
        public etatactive?:Boolean,  
        public procede?:Procede, 
  
    ){
    }
}