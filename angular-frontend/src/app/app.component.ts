//import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AcronymsAdminViewComponent } from './acronyms-admin-view/acronyms-admin-view.component';
import { AcronymsFooterComponent } from './acronyms-footer/acronyms-footer.component';
import { AcronymsUserViewComponent } from './acronyms-user-view/acronyms-user-view.component';
//import { AuthInterceptor } from './interceptor/auth-interceptor';
import { AcronymsService } from './service/acronyms.service';
import { ConfigService } from './service/config.service';
import { HttpService } from './service/http.service';
import { UserService } from './service/user.service';

import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    AcronymsFooterComponent, 
    AcronymsAdminViewComponent, AcronymsUserViewComponent
    //, HttpClientModule
    , FormsModule
    ,RouterOutlet
    , RouterLink
  ],
  providers: [AcronymsService, UserService, HttpService, ConfigService, /*AuthInterceptor,*/ Router
   // , {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true}
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [/*CUSTOM_ELEMENTS_SCHEMA*/] // need this for PrimeNg to work
})

export class AppComponent implements OnInit {

  administrator: boolean = false;
  filterTerm: string = "";

  constructor(private acronymsService: AcronymsService, 
    private userService: UserService,
    private router: Router) {
  }

  isAdministrator = () => {
    return this.userService.isUserAdmin();
  }

  onKeyupFilter = () => {
    //console.log("onkeyup filter: filterTerm = " + this.filterTerm);
    //this.acronymsService.filter(this.filterTerm);

    this.acronymsService.setFilter(this.filterTerm);
    this.acronymsService.applyFilter();
  }

  home() {
    //const authData = document.querySelector('fw-auth').getData();
    const authData = document.querySelector('fw-auth');
    console.log("authData", authData);
    this.administrator = this.userService.isUserAdmin();

    if (this.administrator === true) {
      this.router.navigateByUrl("/acronyms/admin");
    } else {
      console.log("USER");
      this.router.navigateByUrl("/acronyms/view");
    }
  }

  ngOnInit() {
    console.log(environment.where);
    this.home();
  }




}
