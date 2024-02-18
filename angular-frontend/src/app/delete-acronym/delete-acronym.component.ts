import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Acronym } from '../interface/acronym-if';
//import { Tag } from '../interface/tag-if';
import { AcronymsService } from '../service/acronyms.service';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-delete-acronym',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-acronym.component.html',
  styleUrl: './delete-acronym.component.css'
})

export class DeleteAcronymComponent {

  id = "";
  acronym: Acronym;
  status: string = "";
  messageStatusClass : string = "";
  submitButtonClass: string = "";

  //tags: Tag[] = [];

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
    this.enableElements();
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

  onClick = () => {
    //console.log(this.id);
    this.httpService.deleteAcronym(this.id)
      .subscribe((data) => {
        console.log("Delete successful", data);
      });
      console.log("SUCCESS");


    // re-disable the submit button
    this.disableElements(this.acronym.acronym + " has been deleted", "input-box-status-good");
  }



}
