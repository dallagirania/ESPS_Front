import { CarteControle } from './CarteControle.model';

export class MesureCC{
    constructor(
        public id?:number,
        public resultat?:number ,
        public Commentaire?:String ,
        public date?:String,
        public motif_saisie?:String ,
        public operateur?:number,
        public qualiticien?:number, 
        public etatactive?:Boolean,  
        public carte?:CarteControle, 
        public val:number[]=[] 
    ){
    }
}