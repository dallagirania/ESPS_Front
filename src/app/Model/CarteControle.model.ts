import { Procede } from './Procede.model';

export class CarteControle{
    constructor(
        public id?:number,
        public nom?:String ,
        public ref?:String ,
        public nb_valeur?:number,
        public fonction?:string ,
        public min?:String ,
        public max?:String ,
        public etatactive?:Boolean,  
        public procede?:Procede, 
  
    ){
    }
}