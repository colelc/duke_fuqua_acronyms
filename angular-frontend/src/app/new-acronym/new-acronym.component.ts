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
    this.disableElements("", "input-box-status-good");
  }

  ngOnInit(): void {}

  private initAcronym = () => {
    return this.acronymsService.initAcronym();
  }

  private disableElements = (statusMessage:string, messageStatusClass:string) => {
    this.status = statusMessage;
    this.messageStatusClass = messageStatusClass;
    this.submitButtonClass = "submit-button-disabled";
  }

  private enableElements = () => {
    this.status = "";
    this.messageStatusClass = "input-box-status-good";
    this.submitButtonClass = "submit-button";
  }

  onKeyUp = () => {
    let goodName = true;
    if (this.acronym.acronym.length > 0) {
      this.acronym.acronym = this.acronym.acronym.toUpperCase().trim();

      if (this.acronymsService.duplicate(this.acronym.acronym)) {
        goodName = false;
      }
    }

    const tagsOKStatus = this.tagSupport();

    if (this.acronym.acronym.length > 1  
      && this.acronym.definition.length > 0
      && this.acronym.areaKey.length > 0
      && this.acronym.refersTo.length > 0
      && tagsOKStatus.length === 0
      && goodName) {
        this.enableElements();
      } else {
        this.disableElements(tagsOKStatus, tagsOKStatus === "" ? "input-box-status-good" : "input-box-status-bad");
      }
  }

  tagSupport = ():string => {
    this.status = "";
    this.acronym.tagString = this.acronym.tagString.toUpperCase();

    if (this.acronym.tagString.length > 0) {
      // make sure we have alphanumeric characters
        if (!(/^[a-zA-Z0-9, ]+$/.test(this.acronym.tagString))) {
          return "Tag characters must be alphanumeric";
        }
    }
    return "";
  }

  onClick = () => {
    const tagObject = this.acronymsService.trimDedupeCandidateTags(this.acronym.tagString/*, existingTags*/);
    this.acronym.tagString = tagObject["tagString"];

    this.httpService.addAcronym(this.acronym)
      .subscribe(data => {
        console.log("data", data);
        if (data["rows"] === undefined) {
          this.disableElements("You do not appear to have admin privilege required to create new acronyms", "input-box-status-bad");
        } else {
          const newId = data["rows"][0]["id"];
          const newAcronym = data["rows"][0]["acronym"];

          // re-disable the submit button
          this.disableElements(newAcronym + " has been added as a new acronym", "input-box-status-good");
        }
      });

    // clear out fields
    this.acronym = this.initAcronym();

  }

}