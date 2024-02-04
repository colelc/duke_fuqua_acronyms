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
    this.disableElements("");
  }

  private initAcronym = () => {
    return this.acronymsService.initAcronym();
  }

  private disableElements = (statusMessage:string) => {
    this.status = statusMessage;
    this.messageStatusClass = "input-box-status";
    this.submitButtonClass = "submit-button-disabled";
  }

  private enableElements = () => {
    this.status = "";
    this.messageStatusClass = "input-box-status-ready";
    this.submitButtonClass = "submit-button";
  }

  onKeyUp = () => {
    if (this.acronym.acronym.length > 0) {
      this.acronym.acronym = this.acronym.acronym.toUpperCase();
    }

    const tagsOKStatus = this.tagSupport();

    if (this.acronym.acronym.length > 1  
      && this.acronym.definition.length > 0
      && this.acronym.areaKey.length > 0
      && this.acronym.refersTo.length > 0
      && tagsOKStatus.length === 0) {
        this.enableElements();
      } else {
        this.disableElements(tagsOKStatus);
      }
  }

  tagSupport = ():string => {
    this.status = "";
    this.acronym.tagString = this.acronym.tagString.toUpperCase();
    this.acronym.tags = [];

    if (this.acronym.tagString.length > 0) {
      // make sure we have alphanumeric characters
        if (!(/^[a-zA-Z0-9, ]+$/.test(this.acronym.tagString))) {
          return "Tag characters must be alphanumeric";
        }

      // make sure it is comma delimited
      if (!this.acronym.tagString.includes(",")) {
        this.acronym.tags.push(this.acronym.tagString);
        //console.log("this.acronym.tags", this.acronym.tags);
      } else {
        const allTags = this.acronym.tagString.split(",");
        this.acronym.tags = allTags.map((tag) => tag.toUpperCase().trim()).filter((t) => t.length > 0);
       // console.log("this.acronym.tags", this.acronym.tags);
      }
    }
    return "";
  }

  onClick = () => {
    this.httpService.addAcronym(this.acronym)
      .subscribe(data => {
        console.log("data", data);
        if (data["rows"].length === 1) {
          // show success message
          this.status = "Acronym " + data["rows"][0]["acronym"] + " has been added ";
        } else {
          this.status = "Uh oh, something is not right.  Contact your friendly SDS support person";
        }
      });

    // clear out fields
    this.acronym = this.initAcronym();

    // re-disable the submit button
    this.disableElements("");
  }

  ngOnInit(): void {
  }

}