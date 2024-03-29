import { Injectable } from "@angular/core";
import { Acronym } from "../interface/acronym-if";
import { HttpService } from "./http.service";

@Injectable({providedIn: "root"})
export class AcronymsService {

  private acronyms: Acronym[] =  [ ];
  private filterTerm: string = "";

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

  duplicate = (acr:string):boolean => {
    const names=this.getAcronyms().map(name => name.acronym);
    const filtered = names.filter(f => {return f.toUpperCase().trim() === acr.toUpperCase().trim();});
    if (filtered.length > 0) {
      return true;
    }
    return false;
  }

  initAcronym = () => {
    return {
      id: null, 
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
      lastUpdated: "",
      display: true,
      highlight: false
    }
  }

  trimDedupeCandidateTags = (tagString:string/*, existingTags:string[]*/):{tagString:string; tags:string[]} => {
    let candidateTags = tagString.split(",").map((m) => m.trim());
    candidateTags = candidateTags.filter((item, index) => candidateTags.indexOf(item) === index);
    const cleanedTagString = candidateTags.join(", "); // deduped tag string

    const tags = candidateTags.filter(f => true /*!existingTags.includes(f)*/);
    //return cleanedTagString;
    return {
      tagString: cleanedTagString,
      tags: tags
    }
  }

  applyFilter = () => {
   // console.log("applyFilter", this.filterTerm);
    for (let a of this.acronyms) {
       if (!a.tagString.toUpperCase().includes(this.filterTerm.toUpperCase().trim())  
                &&  !a.acronym.toUpperCase().includes(this.filterTerm.toUpperCase().trim())
                &&  !a.refersTo.toUpperCase().includes(this.filterTerm.toUpperCase().trim())
                &&  !a.definition.toUpperCase().includes(this.filterTerm.toUpperCase().trim())) {
          a.display = false;
      } else {
        a.display = true;

      }
    }
  }

  setFilter = (filterTerm:string) => {
    this.filterTerm = filterTerm;
  }

  getFilter = () => {
    return this.filterTerm;
  }

}