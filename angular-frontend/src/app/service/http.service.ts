import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { Acronym } from "../interface/acronym-if";
import { Tag } from "../interface/tag-if";
import { TagMap } from "../interface/tag-map-if";
import { ConfigService } from "./config.service";

@Injectable({providedIn: "root"})
export class HttpService {

  
    constructor(private configService: ConfigService, private http : HttpClient) {}


    // GET ACRONYMS
    getAcronyms(): Observable<Acronym[]> {
      return this.http.get<Acronym[]>("http://localhost:3050/api/acronyms")
        .pipe(
          //tap(_ => console.log("fetched acronyms")),
          catchError(this.handleError<Acronym[]>("getAcronyms", [])),
        );
    }

    // GET ACRONYM_TAGS
    getAcronymTags(): Observable<Tag[]> {
      return this.http.get<Tag[]>("http://localhost:3050/api/acronym_tags")
        .pipe(
          //tap(_ => console.log("fetched acronyms")),
          catchError(this.handleError<Tag[]>("getAcronymTags", [])),
        );
    }

    // GET ACRONYM_TAG_MAP
    getAcronymTagMap(): Observable<TagMap[]> {
      return this.http.get<TagMap[]>("http://localhost:3050/api/acronym_tag_map")
        .pipe(
          //tap(_ => console.log("fetched acronyms")),
          catchError(this.handleError<TagMap[]>("getAcronymTagMap", [])),
        );
    }

    // POST
    addAcronym = (acronym: Acronym):Observable<Acronym> => {
        console.log("HttpService.addAcronym", acronym);

        return this.http.post<Acronym>("http://localhost:3050/api/new_acronym", acronym/*, httpOptions*/)
          .pipe(
            catchError(this.handleError<Acronym>("new Acronym", {
              id: 0,
              acronym: "",
              refersTo: "",
              definition: "",
              areaKey: "",
              active: false,
              tags: [],
              tagString: "",
              createdBy: "",
              created: "",
              lastUpdatedBy: "",
              lastUpdated: ""
            }))
          );
    }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        //this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

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
                tags: ["Admissions"],
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
                tags: ["Tag 1", "Tag 2"],
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
                tags: ["Exec Ed"],
                tagString: "Exec Ed",
                createdBy: "createdBy",
                created: "created",
                lastUpdatedBy: "lastUpdatedBy",
                lastUpdated: "lastUpdated"
              }
        ];
        return testData;
    }

}