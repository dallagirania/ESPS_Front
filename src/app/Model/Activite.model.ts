import { Unite } from "./Unite.model";

export class Activite{
    constructor(
        public id?:number,
        public nom?:String ,
        public ref?:String ,
        public designation?:String,
        public image?:String,
        public unite?:Unite,  
        public etatactive?:Boolean      
    ){
    }
}