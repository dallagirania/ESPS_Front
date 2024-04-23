import { OKD } from './OKD.model';


export class MesureOKD{
    constructor(
        public id?:number,
        public Commentaire?:String ,
        public date_add?:String,
        public date_modif?:String,
        public evenement?:String ,
        public equipe?:String ,
        public operateur?:number,
        public leader?:number,
        public id_qualite?:number,
        public etatactive?:Boolean,  
        public okd?:OKD, 
        public val:number[]=[] 
    ){
    }
}