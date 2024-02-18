import { Component } from '@angular/core';
import { Acronym } from '../interface/acronym-if';
import { AcronymsService } from '../service/acronyms.service';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-acronyms-user-view',
  standalone: true,
  imports: [],
  templateUrl: './acronyms-user-view.component.html',
  styleUrl: './acronyms-user-view.component.css'
})
export class AcronymsUserViewComponent {
  acronyms: Acronym[] = [];

  constructor(private acronymsService: AcronymsService, 
              private httpService: HttpService) {
  }

  ngOnInit() {
   this.getAcronyms();
  }

  highlight(text:string, display: boolean) {
    if (this.acronymsService.getFilter().length === 0) {
      return "<p>" + text+ "</p>";
    } else {
      return text.replace(new RegExp(this.acronymsService.getFilter(), "gi"), match => {
        return '<span class="highlight-text">' + match + '</span>';
    });
    }
  }

  getAcronyms = ():void => {
    // ok, not the best way to do this, but going with it for now
    this.httpService.getAcronyms()
      .subscribe(data => {
        for (let d of data) {
          d.tagString = d["tag_string"];
          //d.tags = [];
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

          d.display = true;
        }

        this.acronymsService.setAcronyms(data);
        // this.acronyms = data;
        this.acronyms = this.acronymsService.getAcronyms();
        console.log("this.acronyms", this.acronyms);
    }); // acronyms
  }



  calculateStriping = (isEven: boolean):string => {
    if (isEven) {
      return "acronym-data-cell";
    } else {
      return "acronym-data-cell acronym-data-cell-striping";
    }
  }
}
