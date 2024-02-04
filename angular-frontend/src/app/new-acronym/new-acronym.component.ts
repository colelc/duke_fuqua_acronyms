import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Acronym } from '../interface/acronym-if';
import { AcronymsService } from '../service/acronyms.service';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-new-acronym',
  standalone: true,
  imports: [FormsModule],
  providers: [],
  templateUrl: './new-acronym.component.html',
  styleUrl: './new-acronym.component.css'
})
export class NewAcronymComponent implements OnInit {
  acronym: Acronym;
  status: string = "";
  messageStatusClass : string = "";
  submitButtonClass: string = "";

  constructor(private acronymsService: AcronymsService, private httpService: HttpService) {
    this.acronym = this.initAcronym();
    this.disableElements();
  }

  private initAcronym = () => {
    return this.acronymsService.initAcronym();
  }

  private disableElements = () => {
    this.status = "Not ready";
    this.messageStatusClass = "input-box-status";
    this.submitButtonClass = "submit-button-disabled";
  }

  private enableElements = () => {
    this.status = "Ready";
    this.messageStatusClass = "input-box-status-ready";
    this.submitButtonClass = "submit-button";
  }

  onKeyUp = () => {
    if (this.acronym.acronym.length > 1  
      && this.acronym.definition.length > 0
      && this.acronym.areaKey.length > 0
      && this.acronym.refersTo.length > 0) {
        this.enableElements();
      } else {
        this.disableElements();
      }
  }

  onClick = () => {
    //this.acronymsService.addAcronym(this.acronym);
    this.httpService.addAcronym(this.acronym)
      .subscribe(data => {
        console.log("data", data);
      });

    // clear out fields
    this.acronym = this.initAcronym();

    // re-disable the submit button
    this.disableElements();

    // show success message
    this.status = "Acronym " + this.acronym.acronym + " has been added ";
  }

  ngOnInit(): void {
  }

}