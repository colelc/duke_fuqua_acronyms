import { Injectable } from "@angular/core";
import { Acronym } from "../interface/acronym-if";
import { HttpService } from "./http.service";

@Injectable({providedIn: "root"})
export class AcronymsService {

  private acronyms: Acronym[] =  [ ];

  constructor(private httpService: HttpService) {

  }

  getAcronyms = ():Acronym[] => {
    return this.acronyms;
  }

  setAcronyms = (acronyms:Acronym[]):void => {
    this.acronyms = [...acronyms];
  }
  
  // getAcronymById = (id: number) => {
  //     for (let a of this.acronyms) {
  //         if (a.id === id) {
  //           return a;
  //         }
  //     }
  //     return null;
  // }

  // setAcronym = (id: number, acronym: string) => {
  //     console.log("setAcronym: id = " + id + " acronym = " + acronym);
  // }

  initAcronym = () => {
    return {
      id: 0, 
      acronym: "", 
      refersTo: "", 
      definition: "",
      areaKey: "",
      active: true,
      tags: [],
      tagString: "",
      createdBy: "",
      created: "",
      lastUpdatedBy: "",
      lastUpdated: ""
    }
  }

  // addAcronym = (newAcronym:Acronym) => {
  //   console.log("addAcronym: ", newAcronym);
  //   this.httpService.addAcronym(newAcronym);
  // }


}