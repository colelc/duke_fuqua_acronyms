import { Component} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AcronymsService } from '../service/acronyms.service';

@Component({
  selector: 'app-acronyms-edit',
  standalone: true,
  imports: [FormsModule],
  providers: [/*AcronymsService*/],
  templateUrl: './acronyms-edit.component.html',
  styleUrl: './acronyms-edit.component.css'
})
export class AcronymsEditComponent {

  constructor(private acronymsService: AcronymsService) {
  }

}

/*
export class AcronymsAdminViewComponent {

  acronyms: Acronym[] = [];
  saved: Saved[] = [];
  enableSaveIcon : string = "disabled-link";

  constructor(private acronymsService: AcronymsService) {
  }

  calculateSaveClass = (id: number) => {
    //console.log("calculateSaveClass for id = " + id);
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

  onSaveAcronym = ( id: number) => {
    console.log("onSaveAcronym: id is " + id);

    // add code to actually save the record


    this.showCheckmark(id);
  }

  onDeleteAcronym = (acronymId: number) => {
    console.log("onDeleteAcronym: acronymId is " + acronymId);

    // add code to actually delete the record

  }

  ngOnInit() {
    this.acronyms = this.acronymsService.getAcronyms();
    this.initCheckmarks();
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
*/
