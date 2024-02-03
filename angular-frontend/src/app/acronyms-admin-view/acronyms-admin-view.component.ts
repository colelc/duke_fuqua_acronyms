import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Acronym } from '../interface/acronym-if';
import { Saved } from '../interface/saved-if';
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

export class AcronymsAdminViewComponent {

  acronyms: Acronym[] = [];
  saved: Saved[] = [];
  enableSaveIcon : string = "disabled-link";

  constructor(private acronymsService: AcronymsService, private httpService: HttpService) {
  }

  async ngOnInit() {
    console.log("AdminViewComponent ngOnInit - calling this.acronymsService.getAcronyms");
    //this.acronyms = this.acronymsService.getAcronyms();
    this.getAcronyms();
   // return this.acronyms;
  }

  public getAcronyms = async () => {
    const acronyms$ = this.httpService.getAcronyms();
    this.acronyms = await lastValueFrom(acronyms$);
    //return this.acronyms;
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
    const filtered = this.saved.filter((obj) => obj.id === id);
    return !filtered[0].saved;
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
