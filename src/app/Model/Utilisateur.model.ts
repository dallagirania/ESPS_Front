import { Activite } from "./Activite.model";
import { Role } from "./Role.model";
import { Unite } from "./Unite.model";

export class Utilisateur{
    constructor(
        public id?:number,
        public username?:String ,
        public prenom?:String ,
        public email?:String ,
        public matricule?:String,
        public image?:String,
        public mdp?:String,
        public role?:Role,   
        public etatactive?:Boolean , 
        public activite_id?:number,
        public unite?:Unite,    

    ){
    }
}
   