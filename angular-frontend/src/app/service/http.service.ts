import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Acronym } from "../interface/acronym-if";
import { ConfigService } from "./config.service";

@Injectable({providedIn: "root"})
export class HttpService {

  
    constructor(private configService: ConfigService, private http : HttpClient) {}

    // POST
    addAcronym = (acronym: Acronym) => {
        console.log("HttpService.addAcronym", acronym);

        // here we will add the new acronym
        this.http.post(
            ConfigService.URL_POST_ACRONYM, 
            acronym
        ).subscribe(response => {
            console.log("response", response);
        });
    }

    // GET
    getAcronyms = ():Observable<Acronym[]> => {
      console.log("HttpService.getAcronyms - HERE IS WHERE WE ARE WORKING");
      return this.http.get<Acronym[]>("http://localhost:3050/api/acronyms")
        .pipe(map(response => response));
    }


    // getAcronyms = ():Acronym[] => {
    //      console.log("HttpService.getAcronyms - HERE IS WHERE WE ARE WORKING");
    //      let retValue:Acronym[] = [];

    //      //this.http.get<{message: string, acronyms:Acronym[]}>("http://localhost:3050/api/acronyms")
    //      //.subscribe();

    //      this.http.get<Acronym[]>("http://localhost:3050/api/acronyms")
    //       .subscribe((data) => {
    //         console.log("data", data);
    //         retValue = data;
    //         console.log("retValue", retValue);
    //        // return data;
    //       });

    //       return retValue;

    //    //return this.getTestData();
    // }

    getTestData = ():Acronym[] => {
        console.log("HttpService.getTestData - HERE WE ARE LOADING IN THE TEST DATA");
        const testData: Acronym[] = [
            {
                id: 35, 
                acronym: "BDW", 
                refersTo: "Blue Devil Weekend", 
                definition: "Weekend-long event for admitted students, organized by the Office of Admissions and student volunteers. There is a BDW in February and again in April to accommodate all admitted studentsâ€™ timelines. Admissions also hosts several other weekend events for prospective Daytime students in Fall. Also, the admitted studentsâ€™ weekend for the MMS and MQM programs is called Blue Devil Experience and for the EMBA programs is called Blue Devil Celebration.", 
                areaKey: "Admissions",
                active: true,
                tags: [
                      {id: 1, tag: "Admissions", active: true, 
                      createdBy: "tagCBy", created: "tagC", lastUpdatedBy: "tagLuBy", lastUpdated: "tagLu"},
                      {id: 2, tag: "Tag 2", active: true, 
                      createdBy: "tagCBy", created: "tagC", lastUpdatedBy: "tagLuBy", lastUpdated: "tagLu"}
                  ],
                tagString: "Tag 1, Tag 2",
                createdBy: "createdBy",
                created: "created",
                lastUpdatedBy: "lastUpdatedBy",
                lastUpdated: "lastUpdated"
              },
              {
                id: 72, 
                acronym: "DEF", 
                refersTo: "refersTo", 
                definition: "definition", 
                areaKey: "areaKey",
                active: true,
                tags: [
                      {id: 1, tag: "Tag 1", active: true, 
                      createdBy: "tagCBy", created: "tagC", lastUpdatedBy: "tagLuBy", lastUpdated: "tagLu"},
                      {id: 2, tag: "Tag 2", active: true, 
                      createdBy: "tagCBy", created: "tagC", lastUpdatedBy: "tagLuBy", lastUpdated: "tagLu"}
                  ],
                tagString: "Tag 1, Tag 2",
                createdBy: "createdBy",
                created: "created",
                lastUpdatedBy: "lastUpdatedBy",
                lastUpdated: "lastUpdated"
              },
              {
                id: 21, 
                acronym: "FANFL", 
                refersTo: "Financial Analysis for Non-Finance Leaders", 
                definition: "This class introduces students to the essential elements of financial reporting, including managerial and financial accounting, and helps them develop a greater understanding of how financial information is used as a strategic tool for decision making.", 
                areaKey: "Exec Ed",
                active: true,
                tags: [
                      {id: 1, tag: "Exec Ed", active: true, 
                      createdBy: "tagCBy", created: "tagC", lastUpdatedBy: "tagLuBy", lastUpdated: "tagLu"},
                      {id: 2, tag: "Tag 2", active: true, 
                      createdBy: "tagCBy", created: "tagC", lastUpdatedBy: "tagLuBy", lastUpdated: "tagLu"}
                  ],
                tagString: "Tag 1, Tag 2",
                createdBy: "createdBy",
                created: "created",
                lastUpdatedBy: "lastUpdatedBy",
                lastUpdated: "lastUpdated"
              }
        ];
        return testData;
    }

}