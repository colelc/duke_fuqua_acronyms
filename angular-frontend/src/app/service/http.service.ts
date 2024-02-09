import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { Acronym } from "../interface/acronym-if";
import { Tag } from "../interface/tag-if";
import { TagMap } from "../interface/tag-map-if";
import { User } from "../interface/user-if";
import { ConfigService } from "./config.service";

@Injectable({providedIn: "root"})
export class HttpService {

  
    constructor(private configService: ConfigService, private http : HttpClient) {}

    // GET USER BY ID
    getUser(dukeId:string): Observable<User> {
      console.log("http service", dukeId);
      return this.http.get<User>("http://localhost:3050/api/user/" + String(dukeId))
      .pipe(
        //tap(_ => console.log("fetched user")),
        catchError(this.handleError<User>("getUser", null)),
      );
    }


    // GET ACRONYMS
    getAcronyms(): Observable<Acronym[]> {
      return this.http.get<Acronym[]>("http://localhost:3050/api/acronyms")
        .pipe(
          //tap(_ => console.log("fetched acronyms")),
          catchError(this.handleError<Acronym[]>("getAcronyms", [])),
        );
    }

    // GET ACRONYM BY ID
    getAcronymById(id:number): Observable<Acronym> {
      return this.http.get<Acronym>("http://localhost:3050/api/acronym/" + String(id))
      .pipe(
        //tap(_ => console.log("fetched acronyms")),
        catchError(this.handleError<Acronym>("getAcronyms", null)),
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
    getAcronymTagMapById(id:number): Observable<TagMap[]> {
      return this.http.get<TagMap[]>("http://localhost:3050/api/acronym_tag_map/" + String(id))
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
            catchError(this.handleError<Acronym>("new Acronym", acronym))
          );
    }

    // PUT
    // editAcronym = (acronym: Acronym):Observable<Acronym> => {
    //   console.log("HttpService.editAcronym", acronym);

    //   return this.http.put<Acronym>("http://localhost:3050/api/edit_acronym", acronym/*, httpOptions*/)
    //     .pipe(
    //       catchError(this.handleError<Acronym>("edit Acronym", acronym))
    //     );
    // }

    // DELETE
    deleteAcronym = (id:string):Observable<number> => {
      console.log("HttpService.deleteAcronym", id);

      return this.http.delete<number>("http://localhost:3050/api/delete_acronym/" + id)
        .pipe(
          catchError(this.handleError<number>("delete Acronym", null))
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

 

}