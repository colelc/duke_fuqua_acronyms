import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpService } from "./http.service";

@Injectable({providedIn: "root"})
export class UserService {
   // user: User = {dukeId: null, isAdmin: false};

    constructor(private httpService: HttpService) { }

    getUser = ():Observable<any> => {
        return this.httpService.getUser();
     }

}