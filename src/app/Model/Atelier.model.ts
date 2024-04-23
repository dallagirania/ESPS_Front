import { Activite } from './Activite.model';

export class Atelier{
    constructor(
        public id?:number,
        public nom?:String ,
        public ref?:String ,
        public designation?:String,
        public image?:String,
        public activite?:Activite,   
        public etatactive?:Boolean     
    ){
    }
}