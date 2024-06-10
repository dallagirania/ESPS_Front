import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = [];

  ngOnInit() {

    // get the user's role
   
    const role = localStorage.getItem('mytoken');

    const login = localStorage.getItem("user")

 

    //MOD

    if (localStorage.getItem('user') == "MOD") {

      this.menu = [

        {
            title: 'Acceuil',
            icon: 'home-outline',
            link: '/pages/dashboard',
            home: true,

        },
        {

          title: 'Liste Procédés Spéciaux',
          icon: 'keypad-outline',
          link:'/pages/home',
          home: true,

        },
        {
          title: 'FONCTIONNALITES',
          group: true,
        },
        {
          title: 'Notifications ',
          //icon: 'keypad-outline',
          icon:'bell-outline',
          link: '/pages/notify',
         
        },
      ];

    }

   //RPUO

   if (localStorage.getItem('user') == "RPUO") {

    this.menu = [
      {
        title: 'Acceuil',
        icon: 'home-outline',
        link: '/pages/dashboard',
        home: true,

    },
    {
      title: 'Liste Procédés Spéciaux',
      icon: 'keypad-outline',
      link:'/pages/home',
      home: true,
     
    },
    {
      title: 'FONCTIONNALITES',
      group: true,
    },
    {
      title: 'Procédés Spéciaux',
      //icon: 'keypad-outline',
      icon:'layers-outline',
      link:'/pages/ListProcede'
     
    },
    {
      title: 'Collaborateur',
      //icon: 'keypad-outline',
      icon:'people',
      link: '/pages/ParametrageRUO',
      home: true,
     
    },
    {
      title: 'Liste d\'Habilitation',
      icon:'list-outline',
      link:'/pages/ListeHabilitation'
     
    },
    {
      title: 'Notifications ',
      //icon: 'keypad-outline',
      icon:'bell-outline',
      link: '/pages/notify',
     
    },
    

    ];

  }


    //RPS

    if (localStorage.getItem('user') == "RPS") {

      this.menu = [
        {
          title: 'Acceuil',
          icon: 'home-outline',
          link: '/pages/dashboard',
          home: true,

      },
      {
        title: 'Liste Procédés Spéciaux',
        icon: 'keypad-outline',
        link:'/pages/home',
        home: true,
       
      },
      {
        title: 'FONCTIONNALITES',
        group: true,
      },
        {
          title: 'Paramétrages Sites',
          //icon: 'keypad-outline',
          icon: 'settings-2-outline',
          link: '/pages/ParametrageSite',
          home: true,
        },
        {
          title: 'Collaborateur',
          //icon: 'keypad-outline',
          icon:'people',
          link: '/pages/ParametrageRUO',
          home: true,
         
        },
        {
          title: 'Notifications ',
          //icon: 'keypad-outline',
          icon:'bell-outline',
          link: '/pages/notify',
         
        },

      

      ];

    }

 
    //Qualiticien

    if (localStorage.getItem('user') == "Qualiticien") {

      this.menu = [
        {
          title: 'Acceuil',
          icon: 'home-outline',
          link: '/pages/dashboard',
          home: true,

      },
      {
        title: 'Liste Procédés Spéciaux',
        icon: 'keypad-outline',
        link:'/pages/home',
        home: true,
       
      },
      {
        title: 'FONCTIONNALITES',
        group: true,
      },
      {
        title: 'Controle ',
        icon:'bulb-outline',
        link: '/pages/Verif',
        home: true,

       
      },
      {
        title: 'Notifications ',
        //icon: 'keypad-outline',
        icon:'bell-outline',
        link: '/pages/notify',
       
      },
      

      ];

    }

     //Methodiste

     if (localStorage.getItem('user') == "Methodiste") {

      this.menu = [
        {
          title: 'Acceuil',
          icon: 'home-outline',
          link: '/pages/dashboard',
          home: true,

      },
      {
        title: 'Liste Procédés Spéciaux',
        icon: 'keypad-outline',
        link:'/pages/home',
        home: true,
       
      },
      {
        title: 'FONCTIONNALITES',
        group: true,
      },
      {
        title: 'Procédés Spéciaux',
        //icon: 'keypad-outline',
        icon:'layers-outline',
        link:'/pages/ListProcede'
       
      },
      {
        title: 'Notifications ',
        //icon: 'keypad-outline',
        icon:'bell-outline',
        link: '/pages/notify',
       
      },
      

      ];

    }

    //AEF

 if (localStorage.getItem('user') == "AEF") {

  this.menu = [
    {
      title: 'Acceuil',
      icon: 'home-outline',
      link: '/pages/dashboard',
      home: true,

  },
  {
    title: 'Liste Procédés Spéciaux',
    icon: 'keypad-outline',
    link:'/pages/home',
    home: true,
   
  },
  {
    title: 'FONCTIONNALITES',
    group: true,
  },
  {
    title: 'Liste d\'Habilitation',
    icon:'list-outline',
    link:'/pages/ListeHabilitation'
   
  },
  {
    title: 'Notifications ',
    //icon: 'keypad-outline',
    icon:'bell-outline',
    link: '/pages/notify',
   
  },
  ];

}

//visiteur
if (localStorage.getItem('mytoken') ==null) {

  this.menu = [
    {
      title: 'Acceuil',
      icon: 'home-outline',
      link: '/pages/dashboard',
      home: true,

  },
  {
    title: 'Liste Procédés Spéciaux',
    icon: 'keypad-outline',
    link:'/pages/home',
    home: true,
   
  },
 
  ];

}

  }
}
