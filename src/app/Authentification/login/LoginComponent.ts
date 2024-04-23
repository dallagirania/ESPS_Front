import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../Service/crud.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../../Model/Utilisateur.model';
import { NbToastrService } from '@nebular/theme';
import Swal from 'sweetalert2';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  currentuser:any
  role:any
  loginFormateurForm: FormGroup;
  constructor(
    private service: CrudService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: NbToastrService) {
    let formControls = {
      mdp: new FormControl('', [
        Validators.required,
      ]),
      matricule: new FormControl('', [
        Validators.required,
        // Validators.email
      ])
    };
    this.loginFormateurForm = this.fb.group(formControls);

  }
  get matricule() { return this.loginFormateurForm.get('matricule'); }
  get mdp() { return this.loginFormateurForm.get('mdp'); }

  loginFormateur() {
    let data = this.loginFormateurForm.value;
    console.log(data);
    
    let user = new Utilisateur(undefined ,undefined,undefined ,undefined,data.matricule,undefined, data.mdp
      ,undefined,undefined,undefined,undefined);
    console.log(user);
    if (!data.matricule || !data.mdp) {
      console.log("champs vides ")
      this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
    
    }else{
   
 this.service.loginUser(user).subscribe(

   res => {
     console.log(res);
     let token=res.token;
     localStorage.setItem("mytoken",token);
     this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      this.role= this.currentuser.role?.nom
      console.log(this.currentuser ,"role : ",   this.role )
      
     localStorage.setItem("user", this.role);
  })
    this.router.navigate(["/pages/dashboard"])
   },
   err => {
    alert("eeee")
     console.log(err);
     console.log("Utilisateur introuvable")
     //this.toastrService.danger('Veuillez remplir tous les champs!!', 'Erreur');
     Swal.fire({
      title: 'Erreur!',
      text: 'Merci de verifier votre login et mot de passe.',
      icon: 'warning',
      confirmButtonColor: '#0CA417',
      confirmButtonText: 'OK'
    });
    
   }

 )
}

  }



  ngOnInit(): void {
    console.log("login");
    this.stopSpinner();
  }

  //Arreter le spinner 
  stopSpinner() {
    const spinner = document.getElementById('nb-global-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }
}
