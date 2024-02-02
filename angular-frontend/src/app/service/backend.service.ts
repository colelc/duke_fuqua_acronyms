import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})

export class BackendService {

    constructor(private http: HttpClient) {

    }

    rootURL = "/api";

        // GET
        getAcronyms = ():Observable<any> => {
            console.log("BackendService.getAcronyms");
            return this.http.get(this.rootURL + "/acronyms")
       }

}