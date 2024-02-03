import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Acronym } from '../interface/acronym-if';
import { Saved } from '../interface/saved-if';
import { Tag } from '../interface/tag-if';
import { TagMap } from '../interface/tag-map-if';
import { AcronymsService } from '../service/acronyms.service';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-acronyms-admin-view',
  standalone: true,
  imports: [FormsModule],
  providers: [],
  templateUrl: './acronyms-admin-view.component.html',
  styleUrl: './acronyms-admin-view.component.css'
})

export class AcronymsAdminViewComponent implements OnInit {

  acronyms: Acronym[] = [];
  tags: Tag[] = [];
  tagMap: TagMap[] = [];
  saved: Saved[] = [];
  enableSaveIcon : string = "disabled-link";

  constructor(private acronymsService: AcronymsService, private httpService: HttpService) {
  }

  ngOnInit() {
    this.getAcronyms();
  }

  getAcronyms = ():void => {
    // ok, not the best way to do this, but going with it for now
    this.httpService.getAcronyms()
      .subscribe(data => {
        for (let d of data) {
          d.tagString = d["tag_string"];
          d.tags = [];
          d.refersTo = d["refers_to"];
          d.areaKey = d["area_key"];
          d.lastUpdatedBy = d["last_updated_by"];
          d.lastUpdated = d["last_updated"];
          delete d["refers_to"];
          delete d["area_key"];
          delete d["tag_string"];
          delete d["created_by"];
          delete d["last_updated"];
          delete d["last_updated_by"];
        }

        this.acronyms = data;
        console.log("this.acronyms", this.acronyms);
        // this.httpService.getAcronymTags()
        //   .subscribe(tagData => {
        //     //console.log("tagData", tagData);
        //     for (let t of tagData) {
        //       t.tag = t["name"];
        //       t.createdBy = t["created_by"];
        //       t.lastUpdated = t["last_updated"];
        //       t.lastUpdatedBy = t["last_updated_by"];
        //       delete t["name"];
        //       delete t["created_by"];
        //       delete t["last_updated"];
        //       delete t["last_updated_by"];
        //     }
        //     this.tags = tagData;
            // console.log("this.acronyms", this.acronyms);
            // console.log("this.tags", this.tags);

            // get the map
            // this.httpService.getAcronymTagMap()
            //   .subscribe(mapData => {
            //     for (let m of mapData) {
            //       m.acronymId = m["acronym_id"];
            //       m.tagId = m["tag_id"];
            //       m.createdBy = m["created_by"];
            //       m.lastUpdated = m["last_updated"];
            //       m.lastUpdatedBy = m["last_updated_by"];
            //       delete m["acronym_id"];
            //       delete m["tag_id"];
            //       delete m["created_by"];
            //       delete m["last_updated"];
            //       delete m["last_updated_by"];
            //     }
            //     this.tagMap = mapData;

            //     console.log("this.acronyms", this.acronyms);
            //     console.log("this.tags", this.tags);
            //     console.log("this.tagMap", this.tagMap);
            //   })
         // }); // acronym_tags
  
    }); // acronyms
  }

  calculateStriping = (isEven: boolean) => {
    if (isEven) {
    return "acronym-data-cell";
    } else {
      return "acronym-data-cell acronym-data-cell-striping";
    }
  }

  calculateEditClass = (id: number) => {
    //console.log("calculateEditClass for id = " + id);
    const a = this.acronymsService.getAcronymById(id);
    if (a !== null) {
      if (a.acronym.length < 2  ||  a.refersTo.length === 0  ||  a.definition.length === 0  ||  a.areaKey.length === 0) {
        return "disabled-link";
      } else {
        return "enabled-link";
      }
    }
    return "disabled-link";
  }

  onEditAcronym = ( id: number) => {
    console.log("onEditAcronym: id is " + id);

    // add code to actually save the record


    this.showCheckmark(id);
  }

  onDeleteAcronym = (acronymId: number) => {
    console.log("onDeleteAcronym: acronymId is " + acronymId);

    // add code to actually delete the record

  }

  private initCheckmarks = () => {
    for (let a of this.acronyms) {
      this.saved.push({id: a.id, saved: false});
    }
  }

  getHidden = (id: number) => {
    //const filtered = this.saved.filter((obj) => obj.id === id);
    //return !filtered[0].saved;
    return true;
  }

  showCheckmark = (id: number) => {
    const filtered = this.saved.filter((obj) => obj.id === id);
    filtered[0].saved = true;
  }

  hideCheckmark = (id: number) => {
    const filtered = this.saved.filter((obj) => obj.id === id);
    filtered[0].saved = false;
  }

}
