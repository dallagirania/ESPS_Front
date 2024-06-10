import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from '../Model/Site.model';
import { Observable } from 'rxjs';
import { Unite } from '../Model/Unite.model';
import { Activite } from '../Model/Activite.model';
import { Atelier } from '../Model/Atelier.model';
import { Role } from '../Model/Role.model';
import { Utilisateur } from '../Model/Utilisateur.model';
import { Procede } from '../Model/Procede.model';
import { OKD } from '../Model/OKD.model';
import { CarteControle } from '../Model/CarteControle.model';
import { Critere } from '../Model/Critere.model';
import { Habilitation } from '../Model/Habilitation.model';
import { Formation } from '../Model/Formation.model';
import { ModFormation } from '../Model/ModFormation.model';
import { ModProcede } from '../Model/ModProcede.model';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MesureCC } from '../Model/MesureCC.model';
import { MesureOKD } from '../Model/MesureOKD.model';
import { Notifications } from '../Model/Notification.model';
import { ProcedeFormationCount } from '../Model/ProcedeFormationCount.model';

const httpOption={
  headers:new HttpHeaders({'Content-Type':'application/Json'})
}
// const httpOptions = {
//   headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
// };

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  loginUrl="http://localhost:8081/api/user/loginUser"
  registerUrl="http://localhost:8081/api/user/registerUser"
  apiUrl="http://localhost:8081/api"
  helper=new JwtHelperService();
  constructor(
     private http: HttpClient,
    private router: Router) 
    { }
    /***************  USER DETAILS  **************** */
    userDetail(){
      let token:any=localStorage.getItem('mytoken');
      if(token!=null)
      {let decotoken=this.helper.decodeToken(token);
      return decotoken.data
    }
    }
    /******************    Site    ******************/
    
    addSite(site:Site){
      console.log(site);
      
      return this.http.post<any>(this.apiUrl+"/site", site);
    }

    getSite():Observable<Site[]>{
      return this.http.get<Site[]>(this.apiUrl+"/site");
    }
    public getSiteById(id : number):Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/site/${id}`);
    
    }
    updateSite(id:number,site:Site):Observable<Site>{
      const Url=`${this.apiUrl+"/site"}/${id}`
      return this.http.put<Site>(Url,site,httpOption)
    }
    deleteSite(id:number|undefined){
      const Url=`${this.apiUrl+"/site"}/${id}`
      return this.http.delete(Url,httpOption)
    }

    /******************    Unite    ******************/
    
    addUnite(unite:Unite){
      return this.http.post<any>(this.apiUrl+"/unite", unite);
    }

    getUnite():Observable<Unite[]>{
      return this.http.get<Unite[]>(this.apiUrl+"/unite");
    }
    getUniteBySite(id:number):Observable<Unite[]>{
      return this.http.get<Unite[]>(`${this.apiUrl}/unite/site/${id}`);
    }
    public getUniteById(id : number):Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/unite/${id}`);
    
    }
    updateUnite(id:number,unite:Unite):Observable<Unite>{
      const Url=`${this.apiUrl+"/unite"}/${id}`
      return this.http.put<Unite>(Url,unite,httpOption)                  
    }
    deleteUnite(id:number|undefined){
      const Url=`${this.apiUrl+"/unite"}/${id}`
      return this.http.delete(Url,httpOption)
    }

     /******************    Activite    ******************/
    
     addActivite(activite:Activite){
      return this.http.post<any>(this.apiUrl+"/activite", activite);
    }

    getActivite():Observable<Activite[]>{
      return this.http.get<Activite[]>(this.apiUrl+"/activite");
    }
    public getActiviteById(id : number):Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/activite/${id}`);
    
    }
    getActivitiesByUniteId(uniteId: number): Observable<Activite[]> {
      return this.http.get<Activite[]>(`${this.apiUrl}/activite/unite/${uniteId}`);
    }
    updateActivite(id: number, activite: Activite): Observable<Activite> {
      const url = `${this.apiUrl}/activite/${id}`;
      return this.http.put<Activite>(url, activite, httpOption); // Send activite object directly
    }
  

     /******************    Atelier    ******************/
    
     addAtelier(atelier:Atelier){
      return this.http.post<any>(this.apiUrl+"/atelier", atelier);
    }

    getAtelier():Observable<Atelier[]>{
      return this.http.get<Atelier[]>(this.apiUrl+"/atelier");
    }
    public getAtelierById(id : number):Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/atelier/${id}`);
    }
    updateAtelier(id: number, atelier: Atelier): Observable<Atelier> {
      const url = `${this.apiUrl}/atelier/${id}`;
      return this.http.put<Atelier>(url, atelier, httpOption); // Send activite object directly
    }
    deleteAtelier(id:number|undefined){
      const Url=`${this.apiUrl+"/atelier"}/${id}`
      return this.http.delete(Url,httpOption)
    }

    getAteliersByActiviteId(activiteId: number): Observable<Atelier[]> {
      return this.http.get<Atelier[]>(`${this.apiUrl}/atelier/activite/${activiteId}`);
    }
      /******************    Role    ******************/
    
      addRole(role:Role){
        return this.http.post<any>(this.apiUrl+"/role", role);
      }
  
      getRole():Observable<Role[]>{
        return this.http.get<Role[]>(this.apiUrl+"/role");
      }
      public getRoleById(id : number):Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/role/${id}`);
      }
      updateRole(id: number, role: Role): Observable<Role> {
        const url = `${this.apiUrl}/atelier/${id}`;
        return this.http.put<Role>(url, role, httpOption); // Send activite object directly
      }

         /******************    User    ******************/
        loginUser(user: Utilisateur) {
          return this.http.post<any>(this.loginUrl, user);
        }
        registerUser(user: Utilisateur) {
          return this.http.post<any>(this.registerUrl, user);
        }
         addUser(user:Utilisateur){
          return this.http.post<any>(this.apiUrl+"/user", user);
        }
    
        getUser():Observable<Utilisateur[]>{
          return this.http.get<Utilisateur[]>(this.apiUrl+"/user");
        }
        getMOD():Observable<Utilisateur[]>{
          return this.http.get<Utilisateur[]>(this.apiUrl+"/user/mod");
        }
        getRUO():Observable<Utilisateur[]>{
          return this.http.get<Utilisateur[]>(this.apiUrl+"/user/RUO");
        }
        getUserByUnit(id : number):Observable<any>{
          return this.http.get<Utilisateur[]>(`${this.apiUrl}/user/unit/${id}`);
        }
        getUserById(id : number):Observable<any>{
          return this.http.get<any>(`${this.apiUrl}/user/${id}`);
        }
        updateUser(id: number, user: Utilisateur): Observable<Role> {
          const url = `${this.apiUrl}/user/${id}`;
          return this.http.put<Utilisateur>(url, user, httpOption); // Send activite object directly
        }

     

           /******************    Procede    ******************/
    
          addProcede(formData: FormData): Observable<any> {
            return this.http.post<any>(this.apiUrl+"/procede", formData);
          }
      
          getProcede():Observable<Procede[]>{
            return this.http.get<Procede[]>(this.apiUrl+"/procede");
          }
          public getProcedeById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/procede/${id}`);
          }
          updateProcede(id: number, procede: Procede): Observable<Procede> {
            const url = `${this.apiUrl}/procede/supprimer/${id}`;
            return this.http.put<Procede>(url, procede, httpOption); // Send activite object directly
          }
          getModProcedeByProcedeId(Id: number): Observable<ModProcede[]> {
            return this.http.get<ModProcede[]>(`${this.apiUrl}/modprocede/procede/${Id}`);
          }

          download(filename): Observable<any>{
            console.log(filename);
            
            return this.http.get(this.apiUrl+"/procede/telechargement/"+filename,
            {
              responseType: 'blob'
            })
            }

            getImage(imageName: string) {
              return this.http.get(this.apiUrl+"/procede/getImage/"+imageName, {  responseType: 'text' });
            }
           /******************    OKD    ******************/
    
          addOKD(okd:OKD){
            return this.http.post<any>(this.apiUrl+"/okd", okd);
          }
      
          getOKD():Observable<OKD[]>{
            return this.http.get<OKD[]>(this.apiUrl+"/okd");
          }
          public getOKDById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/okd/${id}`);
          }
          updateOKD(id: number, okd: OKD): Observable<OKD> {
            const url = `${this.apiUrl}/okd/${id}`;
            return this.http.put<OKD>(url, okd, httpOption); // Send activite object directly
          }

          getOKDByProcedeId(procedeId: number): Observable<OKD[]> {
            return this.http.get<OKD[]>(`${this.apiUrl}/okd/procede/${procedeId}`);
          }

         

           /******************    Carte De Controle    ******************/
       
          addCC(CC:CarteControle){
            return this.http.post<any>(this.apiUrl+"/cc", CC);
          }
      
          getCC():Observable<CarteControle[]>{
            return this.http.get<CarteControle[]>(this.apiUrl+"/cc");
          }
          public getCCById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/cc/${id}`);
          }
          updateCC(id: number, cc: CarteControle): Observable<CarteControle> {
            const url = `${this.apiUrl}/cc/${id}`;
            return this.http.put<CarteControle>(url, cc, httpOption); // Send activite object directly
          }
          getCarteByProcedeId(procedeId: number): Observable<CarteControle[]> {
            return this.http.get<CarteControle[]>(`${this.apiUrl}/cc/procede/${procedeId}`);
          }
            /******************    Critére    ******************/
       
            addCritere(critere:Critere){
              return this.http.post<any>(this.apiUrl+"/critere", critere);
            }
        
            getCritere():Observable<Critere[]>{
              return this.http.get<Critere[]>(this.apiUrl+"/critere");
            }
            public getCritereById(id : number):Observable<any>{
              return this.http.get<any>(`${this.apiUrl}/critere/${id}`);
            }
            updateCritere(id: number, critere: Critere): Observable<Critere> {
              const url = `${this.apiUrl}/critere/${id}`;
              return this.http.put<Critere>(url, critere, httpOption); 
            }

            getCritereByOkdId(okdId: number): Observable<Critere[]> {
              return this.http.get<Critere[]>(`${this.apiUrl}/critere/okd/${okdId}`);
            }
              
       
          /******************    Liste Habilitation    ******************/
              
          addHabilitation(habilitation:Habilitation){
            return this.http.post<any>(this.apiUrl+"/habilitation", habilitation);
          }

          getHabilitation():Observable<Habilitation[]>{
            return this.http.get<Habilitation[]>(this.apiUrl+"/habilitation");
          }
          public getHabilitationById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/habilitation/${id}`);
          }
          updateHabilitation(id: number, habilitation: Habilitation): Observable<Habilitation> {
            const url = `${this.apiUrl}/habilitation/${id}`;
            return this.http.put<Habilitation>(url, habilitation, httpOption); // Send activite object directly
          }
          getHabilitationByProcedeId(procedeId: number): Observable<Habilitation[]> {
            return this.http.get<Habilitation[]>(`${this.apiUrl}/habilitation/procede/${procedeId}`);
          }

          getHabilitationByUnite(id: number): Observable<Habilitation[]> {
            return this.http.get<Habilitation[]>(`${this.apiUrl}/habilitation/unite/${id}`);
          }
   /******************    Formation    ******************/
    
          addFormation(formData: FormData): Observable<any> {
            // Envoyer la requête POST avec le FormData en tant que corps de la requête
            return this.http.post<any>(this.apiUrl+"/formation", formData);
          }
      
          getFormation():Observable<Formation[]>{
            return this.http.get<Formation[]>(this.apiUrl+"/formation");
          }
          public getFormationById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/formation/${id}`);
          }
          updateFormation(formData: FormData): Observable<Formation> {
            return this.http.put<any>(this.apiUrl+"/formation", formData);

          }
          supprimerFormation(id: number, formmation: Formation): Observable<Formation> {
            const url = `${this.apiUrl}/formation/supprimer/${id}`;
            return this.http.put<Formation>(url, formmation, httpOption);// Send activite object directly
          }
          getFormationByHabilitationId(habId: number): Observable<Formation[]> {
            return this.http.get<Formation[]>(`${this.apiUrl}/formation/habilitation/${habId}`);
          }
          getUserByHabilitationId(habId: number): Observable<Utilisateur[]> {
            return this.http.get<Utilisateur[]>(`${this.apiUrl}/habilitation/${habId}/users`);
          }
          getAllUserByHabilitationId(habId: number): Observable<Utilisateur[]> {
            return this.http.get<Utilisateur[]>(`${this.apiUrl}/habilitation/${habId}/allusers`);
          }

          getAllUserByHabilitationIdandDate(habId: number): Observable<Utilisateur[]> {
            return this.http.get<Utilisateur[]>(`${this.apiUrl}/habilitation/date/${habId}/users`);
          }
          getFormationByDernierDate(habId: number): Observable<Formation[]> {
            return this.http.get<Formation[]>(`${this.apiUrl}/formation/denier_date/${habId}`);
          }

         getFormationByAcce(habId: number): Observable<Formation[]> {
            return this.http.get<Formation[]>(`${this.apiUrl}/formation/accee/${habId}`);
          }

        
          /******************   Historiques Formation    ******************/
    
           addModFormation(formData: FormData): Observable<any> {
            // Envoyer la requête POST avec le FormData en tant que corps de la requête
            return this.http.post<any>(this.apiUrl+"/modformation", formData);
          }
      
          getModFormation():Observable<ModFormation[]>{
            return this.http.get<ModFormation[]>(this.apiUrl+"/modformation");
          }
          public getModFormationById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/modformation/${id}`);
          }
          updateModFormation(id: number, formmation: ModFormation): Observable<ModFormation> {
            const url = `${this.apiUrl}/modformation/${id}`;
            return this.http.put<ModFormation>(url, formmation, httpOption); // Send activite object directly
          }
          getModFormationByFormationId(Id: number): Observable<ModFormation[]> {
            return this.http.get<ModFormation[]>(`${this.apiUrl}/modformation/formation/${Id}`);
          }

          downloadFile(filename): Observable<any>{
            console.log(filename);
            
            return this.http.get(this.apiUrl+"/modformation/telechargement/"+filename,
            {
              responseType: 'blob'
            })
        
            }

              /******************   Historiques Procede    ******************/
    
           addModProcede(formData: FormData): Observable<any> {
            // Envoyer la requête POST avec le FormData en tant que corps de la requête
            return this.http.post<any>(this.apiUrl+"/modprocede", formData);
          }

          getModProcede():Observable<ModProcede[]>{
            return this.http.get<ModProcede[]>(this.apiUrl+"/modprocede");
          }
          public getModProcedeById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/modprocede/${id}`);
          }
      
           
          getProcedeByDernierDate(Id: number): Observable<Procede> {
            return this.http.get<Procede>(`${this.apiUrl}/procede/denier_date/${Id}`);
          }
        
        
          getProcedeDernier():Observable<Procede[]>{
            return this.http.get<Procede[]>(this.apiUrl+"/procede/denier_date");
          }

          getProcedeDernierByUnite(IdUnite: number):Observable<Procede[]>{
            return this.http.get<Procede[]>(`${this.apiUrl}/procede/denier/${IdUnite}`);
          }
          getProcedeDernierBySite(IdSite: number):Observable<Procede[]>{
            return this.http.get<Procede[]>(`${this.apiUrl}/procede/site/${IdSite}`);
          }

           /******************    MesureCC    ******************/
       
           addMesureCC(mesureCC:MesureCC){
            return this.http.post<any>(this.apiUrl+"/mesureCC", mesureCC);
          }
      
          getMesureCC():Observable<MesureCC[]>{
            return this.http.get<MesureCC[]>(this.apiUrl+"/mesureCC");
          }
          getAllMesureCC(id:number):Observable<MesureCC[]>{
            return this.http.get<MesureCC[]>(`${this.apiUrl}/mesureCC/All/${id}`);
          }
          public getMesureCCById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/mesureCC/${id}`);
          }
          updateMesureCC(id: number, mesureCC: MesureCC): Observable<MesureCC> {
            const url = `${this.apiUrl}/mesureCC/${id}`;
            return this.http.put<MesureCC>(url, mesureCC, httpOption); 
          }

          getMesureCCByCarteId(Id: number): Observable<MesureCC[]> {
            return this.http.get<MesureCC[]>(`${this.apiUrl}/mesureCC/user/${Id}`);
          }
         mailblockC(mesureCC:MesureCC){
            return this.http.post<any>(this.apiUrl+"/mesureCC/notifyBlockage", mesureCC);
          }
          mailValidation(mesureCC:MesureCC){
            return this.http.post<any>(this.apiUrl+"/mesureCC/notifyValidation", mesureCC);
          }
          mailNonConformite(mesureCC:MesureCC){
            return this.http.post<any>(this.apiUrl+"/mesureCC/notifyNC", mesureCC);
          }
         
         getMesureCCData(id: number): Observable<any[]> {
          const url = `${this.apiUrl}/mesureCC/valWithDateByCarteControle1/${id}`;
          return this.http.get<any[]>(url);
        }
        
         getResultatData(id: number): Observable<any[]> {
          const url = `${this.apiUrl}/mesureCC/ResultatWithDateByCarteControle1/${id}`;
          return this.http.get<any[]>(url);
         }
        
          getFixedValuesByCarteId(carteId: number): Observable<any[]> {
            return this.http.get<any[]>(`${this.apiUrl}/mesureCC/fixed-values/${carteId}`);
          }
           /******************    MesureOKD    ******************/
       
          addMesureOKD(mesureOKD:MesureOKD){
            return this.http.post<any>(this.apiUrl+"/mesureOKD", mesureOKD);
          }
      
          getMesureOKD(id:number):Observable<MesureOKD[]>{
            return this.http.get<MesureOKD[]>(`${this.apiUrl}/mesureOKD/All/${id}`);
          }
          public getMesureOKDById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/mesureOKD/${id}`);
          }
          public getMesureOKDDetailById(id : number):Observable<any>{
            return this.http.get<any>(`${this.apiUrl}/mesureOKD/detail/${id}`);
          }
          updateMesureOKD(id: number, mesureOKD: MesureOKD): Observable<MesureOKD> {
            const url = `${this.apiUrl}/mesureOKD/${id}`;
            return this.http.put<MesureOKD>(url, mesureOKD, httpOption); 
          }
          
          getMesureOKDByOKDId(Id: number): Observable<MesureOKD[]> {
            return this.http.get<MesureOKD[]>(`${this.apiUrl}/mesureOKD/okd/${Id}`);
          }
          getMesureOKDByOKDExportId(Id: number): Observable<MesureOKD[]> {
            return this.http.get<MesureOKD[]>(`${this.apiUrl}/mesureOKD/okdExport/${Id}`);
          }
          mailblockOKD(mesureCC:MesureOKD){
            return this.http.post<any>(this.apiUrl+"/mesureOKD/notifyBlockage", mesureCC);
          }

          mailValidationOKD(mesureCC:MesureOKD){
            return this.http.post<any>(this.apiUrl+"/mesureOKD/notifyValidationOKD", mesureCC);
          }

          mailNonConformiteOKD(mesureCC:MesureOKD){
            return this.http.post<any>(this.apiUrl+"/mesureOKD/notifyNC", mesureCC);
          }


          /*********************************** Gestion des Notifications ********************************************* */
        
          getNotification():Observable<Notifications[]>{
            return this.http.get<Notifications[]>(this.apiUrl+"/notification");
          }
         
          getNotificationByMatricule(matricule: String):Observable<Notifications[]>{
            return this.http.get<Notifications[]>(`${this.apiUrl}/notification/user/${matricule}`);
          }

          updateNotify(id: number, notify: Notifications): Observable<Notifications> {
            const url = `${this.apiUrl}/notification/${id}`;
            return this.http.put<Notifications>(url, notify, httpOption);
          }
          /********************************************* Courbe Etendu ***************************************************************/

          getValEtendu(id: number):Observable<any[]>{
            return this.http.get<any[]>(`${this.apiUrl}/mesureCC/differencesVal/${id}`);
          }
          getResEtendu(id: number):Observable<any[]>{
            return this.http.get<any[]>(`${this.apiUrl}/mesureCC/differencesRes/${id}`);
          }


          /********************************************* Dashboard  Performance PS ************************************************************ */
          countQualifiedProcedes(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/procede/countQualified`, procedes);
          }
        
          countNonQualifiedProcedes(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/procede/countNonQualified`, procedes);
          }
        
          countRequalificationNeededProcedes(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/procede/countRequalificationNeeded`, procedes);
          }

          countQualificationProcedesMensuel(procedes: Procede[]): Observable<number[]> {
            return this.http.post<number[]>(`${this.apiUrl}/procede/countqualificationNeededMensuelle`, procedes);
          }

          countHabilitationProcedesTotal(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/habilitation/totalFormations`, procedes);
          }

          countHabilitationProcedesValide(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/habilitation/ValideFormations`, procedes);
          }
          countHabilitationProcedesReValide(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/habilitation/ReValideFormations`, procedes);
          }

          countHabilitationProcedesNonValide(procedes: Procede[]): Observable<number> {
            return this.http.post<number>(`${this.apiUrl}/habilitation/NonValideFormations`, procedes);
          }


          getValideFormationCountForQualifiedProcedes(procedes: Procede[]): Observable<ProcedeFormationCount[]> {
            return this.http.post<ProcedeFormationCount[]>(`${this.apiUrl}/habilitation/ValideformationCount`, procedes);
          }
          getReValideFormationCountForQualifiedProcedes(procedes: Procede[]): Observable<ProcedeFormationCount[]> {
            return this.http.post<ProcedeFormationCount[]>(`${this.apiUrl}/habilitation/ReValideformationCount`, procedes);
          }
          getNonValideFormationCountForQualifiedProcedes(procedes: Procede[]): Observable<ProcedeFormationCount[]> {
            return this.http.post<ProcedeFormationCount[]>(`${this.apiUrl}/habilitation/NonValideformationCount`, procedes);
          }



          countMesureOKDByUniteId(uniteId: number): Observable<number> {
            return this.http.get<number>(`${this.apiUrl}/mesureOKD/countOKDByUnite/${uniteId}`);
          }
          countMesureCCByUniteId(uniteId: number): Observable<number> {
            return this.http.get<number>(`${this.apiUrl}/mesureCC/countCCByUnite/${uniteId}`);
          }
          
          countMesureCCBySiteId(uniteId: number): Observable<number> {
            return this.http.get<number>(`${this.apiUrl}/mesureCC/countCCBySite/${uniteId}`);
          }
          countMesureOKDBySiteId(uniteId: number): Observable<number> {
            return this.http.get<number>(`${this.apiUrl}/mesureOKD/countOKDBySite/${uniteId}`);
          }
          countOKDAll():Observable<number>{
            return this.http.get<number>(this.apiUrl+"/mesureOKD/countOKDAll");
          }
          countCCAll():Observable<number>{
            return this.http.get<number>(this.apiUrl+"/mesureCC/countCCAll");
          }
          

          countMesureTotalByProcedeAndMonth(procedes: Procede[]): Observable<any> {
            return this.http.post<any[]>(`${this.apiUrl}/mesureCC/totalCountByMonthForProcedes`, procedes);
          }

          countMesureTotalByProcede(procedes: Procede[]): Observable<any> {
            return this.http.post<any[]>(`${this.apiUrl}/mesureCC/total`, procedes);
          }

          LeadTime(uniteId: number): Observable<string> {
            return this.http.get(`${this.apiUrl}/mesureCC/average-duration/unite/${uniteId}`, { responseType: 'text' });
          }
        }
