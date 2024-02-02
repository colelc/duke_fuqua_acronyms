import { Component, OnInit } from '@angular/core';

//import { NgOptimizedImage } from '@angular/common';
import { Acronym } from '../interface/acronym-if';
import { AcronymsService } from '../service/acronyms.service';

@Component({
  selector: 'app-acronyms-list',
  standalone: true,
  imports: [],
  providers: [/*AcronymsService*/],
  templateUrl: './acronyms-list.component.html',
  styleUrl: './acronyms-list.component.css'
})
export class AcronymsListComponent implements OnInit {
  acronyms: Acronym[] = [];

  constructor(private acronymsService: AcronymsService) {
  }

  ngOnInit() {
    console.log("acronyms-list-component: ngOnInit");
    this.acronyms = this.acronymsService.getAcronyms();
  }

  onEditAcronym(event: any, acronymId: number) {
    console.log("onEditAcronym: acronymId is " + acronymId);
    //console.log("event", event);
  }

  onDeleteAcronym(event: any, acronymId: number) {
    console.log("onDeleteAcronym: acronymId is " + acronymId);
    //console.log("event", event);
  }



}
