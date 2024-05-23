import { OKD } from './OKD.model';

export class Critere{
    constructor(
        public id?:number,
        public nom?:String ,
        public type?:String ,
        public valeur?:String ,
        public min?:String ,
        public max?:String ,
        public mesureNC?:String ,
        public etatactive?:Boolean,  
        public okd?:OKD, 
  
    ){
    }
}