import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AcronymsAdminViewComponent } from './acronyms-admin-view/acronyms-admin-view.component';
import { AcronymsUserViewComponent } from './acronyms-user-view/acronyms-user-view.component';
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
    AcronymsAdminViewComponent, AcronymsUserViewComponent
    , FormsModule
    ,RouterOutlet
    , RouterLink
  ],
  providers: [AcronymsService, UserService, HttpService, ConfigService, Router
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [/*CUSTOM_ELEMENTS_SCHEMA*/] // would need this for PrimeNg to work
})

export class AppComponent implements OnInit {

  administrator: boolean = false;
  filterTerm: string = "";

  constructor(private acronymsService: AcronymsService, 
    private userService: UserService,
    private router: Router) {
  }

  onKeyupFilter = () => {
    this.acronymsService.setFilter(this.filterTerm);
    this.acronymsService.applyFilter();
  }

  home() {
    try {
      this.userService.getUser().subscribe(data => {
        if (data === null  ||  (data  && data.error)) {
          console.log("Cannot identify user - we will default to non-admin status");
          this.view(data);
        } else {
          if (data.length > 0) {
            this.admin(data);
          } else {
            this.view(data);
          }
        }
      });
    } catch(err) {
      console.log("uh oh, a backend error - we will default to non-admin status");
      this.view([]);
    }
  }

  admin = (data:Array<any>) => {
    console.log("ADMIN", data);
    this.administrator = true;
    this.router.navigateByUrl("/acronyms/admin");
  }

  view = (data:Array<any>) => {
    console.log("USER", data);
    this.administrator = false;
    this.router.navigateByUrl("/acronyms/view");
  }

  ngOnInit() {
    console.log(environment.where);
    this.home();
  }




}