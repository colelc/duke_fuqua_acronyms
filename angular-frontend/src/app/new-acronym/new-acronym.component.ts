import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Acronym } from '../interface/acronym-if';
import { Tag } from '../interface/tag-if';
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

  tags: Tag[] = [];

  constructor(private acronymsService: AcronymsService, private httpService: HttpService) {
    this.acronym = this.initAcronym();
    this.disableElements("");
  }

  ngOnInit(): void {
    this.getTags();
  }

  getTags = ():void => {
    // ok, not the best way to do this, but going with it for now
    this.httpService.getAcronymTags() 
    .subscribe(data => {
      for (let d of data) {
        d.tag = d["name"];
        d.createdBy = d["created_by"];
        d.lastUpdatedBy = d["last_updated_by"];
        d.lastUpdated = d["last_updated"];
        delete d["name"];
        delete d["created_by"];
        delete d["last_updated_by"];
        delete d["last_updated"];
      }

      this.tags = [...data];
      console.log("tags", this.tags);
    });
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
    const existingTags = this.tags.map(tag => tag.tag);
    this.acronym.tags= this.acronym.tags.filter(tag => !existingTags.includes(tag));
    console.log("new tag(s)", this.acronym.tags);

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

  doTheAdd = () => {

  }



}