import { OKD } from './OKD.model';


export class MesureOKD{
    constructor(
        public id?:number,
        public commentaire?:String ,
        public date_add?:String,
        public date_modif?:String,
        public evenement?:String ,
        public equipe?:String ,
        public operateur?:number,
        public qualiticien?:number,
        public etatactive?:Boolean,  
        public etatvalide?:Boolean,  
        public okd?:OKD, 
        public operateurNom?:string,
        public operateurPrenom?:string,
        public qualiticienNom?:string,
        public qualiticienPrenom?:string,
        public val?: Record<string,string>
    ){
    }
}