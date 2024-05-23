import { CarteControle } from './CarteControle.model';

export class MesureCC{
    constructor(
        public id?:number,
        public resultat?:number ,
        public commentaire?:String ,
        public date?:String,
        public date_valide?:String,
        public motif_saisie?:String ,
        public operateur?:number,
        public operateurNom?:string,
        public qualiticienNom?:string,
        public qualiticien?:number, 
        public etatactive?:Boolean,  
        public etatvalide?:Boolean,  
        public carte?:CarteControle, 
        public val:number[]=[] 
    ){
    }
}