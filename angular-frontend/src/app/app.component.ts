import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AcronymsAdminViewComponent } from './acronyms-admin-view/acronyms-admin-view.component';
import { AcronymsFooterComponent } from './acronyms-footer/acronyms-footer.component';
import { AcronymsUserViewComponent } from './acronyms-user-view/acronyms-user-view.component';
import { AcronymsService } from './service/acronyms.service';
import { ConfigService } from './service/config.service';
import { HttpService } from './service/http.service';
import { UserService } from './service/user.service';

import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    AcronymsFooterComponent, 
    AcronymsAdminViewComponent, AcronymsUserViewComponent
    , HttpClientModule
    , FormsModule
    ,RouterOutlet
    , RouterLink
  ],
  providers: [AcronymsService, UserService, HttpService, ConfigService, Router],
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
    this.acronymsService.filter(this.filterTerm);
  }

  home() {
    this.administrator = this.userService.isUserAdmin();

    if (this.administrator === true) {
      console.log("ADMIN");
      this.router.navigateByUrl("/admin");
    } else {
      console.log("USER");
      this.router.navigateByUrl("/view");
    }
  }

  ngOnInit() {
    this.home();
  }




}
