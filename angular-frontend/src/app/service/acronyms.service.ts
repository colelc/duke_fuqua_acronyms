import { Injectable } from "@angular/core";
import { Acronym } from "../interface/acronym-if";
import { BackendService } from "./backend.service";
import { HttpService } from "./http.service";

@Injectable({providedIn: "root"})
export class AcronymsService {

  private acronyms: Acronym[] =  [ ];
  //private x = new Array<Acronym>();

  constructor(private httpService: HttpService, private backendService: BackendService) {

  }


  // public getAcronyms = async () => {
  //     const acronyms$ = this.httpService.getAcronyms();
  //     this.acronyms = await lastValueFrom(acronyms$);
  //     return this.acronyms;
  // }
  
  // getAcronyms = () => {
  //   try {
  //     this.httpService.getAcronyms()
  //       .subscribe((data) => {
  //         console.log("data", data);
  //         this.acronyms = data;  
  //         return this.acronyms;
  //      });
  //     } catch(err) {
  //       console.log("uh oh, error, returning the test data", err);
  //       this.acronyms = this.httpService.getTestData();
  //       return this.acronyms;
  //     }

  //     console.log("uh oh, error, returning the test data");
  //     this.acronyms = [];
  //     return this.acronyms;
  // }

  getAcronymById = (id: number) => {
      for (let a of this.acronyms) {
          if (a.id === id) {
            return a;
          }
      }
      return null;
  }

  setAcronym = (id: number, acronym: string) => {
      console.log("setAcronym: id = " + id + " acronym = " + acronym);
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

  addAcronym = (newAcronym:Acronym) => {
    console.log("addAcronym: ", newAcronym);
    this.httpService.addAcronym(newAcronym);
  }

    // initializeNewAcronym = () => {
    //   console.log("initialize new acronym");
    //   const newAcronymList: Acronym[] = [];
    //   newAcronymList.push(a);

    //   for (let a of this.acronyms) {
    //     newAcronymList.push(a);
    //   }

    //   this.acronyms = [...newAcronymList];

    //   for (let a of this.acronyms) {
    //     console.log(a);
    //   }
    // }



}