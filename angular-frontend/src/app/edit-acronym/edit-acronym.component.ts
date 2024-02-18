import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Acronym } from '../interface/acronym-if';
import { AcronymsService } from '../service/acronyms.service';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-edit-acronym',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-acronym.component.html',
  styleUrl: './edit-acronym.component.css'
})
export class EditAcronymComponent {
  id = "";
  acronym: Acronym;
  status: string = "";
  messageStatusClass : string = "";
  submitButtonClass: string = "";

  constructor(private acronymsService: AcronymsService, 
            private activatedRoute: ActivatedRoute,
            private httpService: HttpService) {

    this.enableElements();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get("id");
    });
    this.acronym = this.acronymsService.getAcronymById(Number(this.id));
  }

  private disableElements = (statusMessage:string, messageStatusClass:string) => {
    this.status = statusMessage;
    this.messageStatusClass = messageStatusClass;
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
    const tagObject = this.acronymsService.trimDedupeCandidateTags(this.acronym.tagString);
    this.acronym.tagString = tagObject["tagString"];

    this.httpService.addAcronym(this.acronym)
      .subscribe(data => {
        console.log("data", data);
        if (data["rows"] === undefined) {
          this.disableElements("You do not appear to have admin privilege required to edit acronyms", "input-box-status-bad");
        } else {
          // re-disable the submit button
          this.disableElements(this.acronym.acronym + " has been edited AND saved", "input-box-status-good");
        }
      });

    // re-init
    this.acronym = this.acronymsService.getAcronymById(Number(this.id));

  }

}