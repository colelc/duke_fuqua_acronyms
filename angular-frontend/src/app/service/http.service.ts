import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { Acronym } from "../interface/acronym-if";
//import { Tag } from "../interface/tag-if";
//import { TagMap } from "../interface/tag-map-if";
import { User } from "../interface/user-if";
import { ConfigService } from "./config.service";

@Injectable({providedIn: "root"})
export class HttpService {

    API_BASE: string;

    constructor(private configService: ConfigService, private http : HttpClient) {
      this.API_BASE = ConfigService.API_BASE;
      console.log("this.API_BASE", this.API_BASE);
    }

    // GET USER BY ID
    // getUser(dukeId:string): Observable<User> {
      getUser(): Observable<User> {
      // return this.http.get<User>(this.API_BASE + "/api/user/" + String(dukeId))
      return this.http.get<User>(this.API_BASE + "/api/user")
      .pipe(
        //tap(_ => console.log("fetched user")),
        catchError(this.handleError<User>("getUser", null)),
      );
    }


    // GET ACRONYMS
    getAcronyms(): Observable<Acronym[]> {
      return this.http.get<Acronym[]>(this.API_BASE + "/api/acronyms")
        .pipe(
          //tap(_ => console.log("fetched acronyms")),
          catchError(this.handleError<Acronym[]>("getAcronyms", [])),
        );
    }

    // GET ACRONYM BY ID
    getAcronymById(id:number): Observable<Acronym> {
      return this.http.get<Acronym>(this.API_BASE + "/api/acronym/" + String(id))
      .pipe(
        //tap(_ => console.log("fetched acronyms")),
        catchError(this.handleError<Acronym>("getAcronyms", null)),
      );
    }

    // POST
    addAcronym = (acronym: Acronym):Observable<Acronym> => {
        return this.http.post<Acronym>(this.API_BASE + "/api/new_acronym", acronym)
          .pipe(
            catchError(this.handleError<Acronym>("new Acronym", acronym))
          );
    }

    // DELETE
    deleteAcronym = (id:string):Observable<number> => {

      return this.http.delete<number>(this.API_BASE + "/api/delete_acronym/" + id)
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
       // return of(result as T);
        return of(error as T);
      };
    }

 

}