import { Site } from "./Site.model";

export class Unite{
    constructor(
        public id?:number,
        public nom?:String ,
        public ref?:String ,
        public designation?:String,
        public image?:String,
        public site?:Site,  
        public etatactive?:Boolean      
    ){
    }
}