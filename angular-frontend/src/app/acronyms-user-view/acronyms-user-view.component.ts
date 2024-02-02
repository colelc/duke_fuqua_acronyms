import { Component } from '@angular/core';
import { Acronym } from '../interface/acronym-if';
import { AcronymsService } from '../service/acronyms.service';

@Component({
  selector: 'app-acronyms-user-view',
  standalone: true,
  imports: [],
  templateUrl: './acronyms-user-view.component.html',
  styleUrl: './acronyms-user-view.component.css'
})
export class AcronymsUserViewComponent {
  acronyms: Acronym[] = [];

  constructor(private acronymsService: AcronymsService) {
  }

  calculateStriping = (isEven: boolean) => {
    if (isEven) {
    return "acronym-data-cell";
    } else {
      return "acronym-data-cell acronym-data-cell-striping";
    }
  }

  ngOnInit() {
    this.acronyms = this.acronymsService.getAcronyms();
  }

}
