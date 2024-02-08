import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Acronym } from '../interface/acronym-if';
import { Tag } from '../interface/tag-if';
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
  //dbAcronym: Acronym;
  status: string = "";
  messageStatusClass : string = "";
  submitButtonClass: string = "";

  tags: Tag[] = [];

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

    //this.dbAcronym = this.acronymsService.initAcronym();
    //this.getAcronymFromDb();
   // this.getTagMapFromDb();
    this.getTags();
  }

  // getAcronymFromDb = ():void => {
  //   this.httpService.getAcronymById(Number(this.id))
  //     .subscribe(data => {
  //       //console.log("data", data);
  //       const db = data[0];
  //       //console.log("db", db);
  //       this.dbAcronym.tagString = db["tag_string"];
  //       this.dbAcronym.tags = [];
  //       this.dbAcronym.refersTo = db["refers_to"];
  //       this.dbAcronym.areaKey = db["area_key"];
  //       this.dbAcronym.lastUpdatedBy = db["last_updated_by"];
  //       this.dbAcronym.lastUpdated = db["last_updated"];
  //       delete db["refers_to"];
  //       delete db["area_key"];
  //       delete db["tag_string"];
  //       delete db["created_by"];
  //       delete db["last_updated"];
  //       delete db["last_updated_by"];
  //     });
  // }

  // getTagMapFromDb = ():void => {
  //   //console.log("editAcronym, getTagMapFromDb", this.id);
  //   this.httpService.getAcronymTagMapById(Number(this.id))
  //     .subscribe(data => {
  //         //console.log("data", data);
  //         for (let tm of data) {
  //           console.log(tm);
  //           tm.acronymId = Number(this.id);
  //           tm.tagId = tm["tag_id"];
  //           tm.createdBy = tm["created_by"];
  //           tm.lastUpdated = tm["last_updated"];
  //           tm.lastUpdatedBy = tm["last_updated_by"];

  //           delete tm["tag_id"];
  //           delete tm["created_by"];
  //           delete tm["last_updated"];
  //           delete tm["last_updated_by"];
  //       }
  //       this.dbTagMap = data;
  //       console.log("this.dbTagMap", this.dbTagMap);
  //      });
  // }


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
    const existingTags = this.tags.map(tag => tag.tag);

    this.acronym.tags = [];

    const tagObject = this.acronymsService.trimDedupeCandidateTags(this.acronym.tagString, existingTags);
    this.acronym.tagString = tagObject["tagString"];
    this.acronym.tags = tagObject["tags"];
    
    const toArray = this.acronym.tagString.split(",").map((m) => m.trim());
    for (let item of toArray) {
      if (!existingTags.includes(item)) {
        this.acronym.tags.push(item);
      }
    }

    console.log("acronym tagStrings", this.acronym.tagString);
    console.log("acronym tags", this.acronym.tags);

    this.httpService.addAcronym(this.acronym)
      .subscribe(data => {
        console.log("data", data);
        if (data["rows"].length === 1) {
          // show success message
          this.status = "Acronym " + data["rows"][0]["acronym"] + " has been edited and saved ";

          // refresh tag list
          this.getTags();
        } else {
          this.status = "Uh oh, something is not right.  Contact your friendly SDS support person";
        }
      });
      console.log("SUCCESS");

    // re-init
    this.acronym = this.acronymsService.getAcronymById(Number(this.id));
    this.getTags();

    // re-disable the submit button
    this.disableElements(this.acronym.acronym + " has been edited", "input-box-status-good");
  }



}