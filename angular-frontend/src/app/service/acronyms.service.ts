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
  
  getAcronymById = (id: number):Acronym => {
      const result = this.acronyms.filter((a) => a.id === id);
      if (result.length === 1) {
        return result[0];
      }
      return null;
  }

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

}