import { Injectable } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { User } from "../interface/user-if";
import { HttpService } from "./http.service";

@Injectable({providedIn: "root"})
export class UserService {
    user: User;
    dukeId: string;

    // private user : User = {
    //     dukeId: "lcc9",
    //     firstName: "Linda",
    //     lastName: "Cole",
    //     isAdmin: true
    // };

    constructor(private httpService: HttpService, private activatedRoute: ActivatedRoute) {
        //this.user = this.getUser();
        this.activatedRoute.paramMap.subscribe((params) => {
            this.dukeId = params.get("id");
          });

        this.getUser();
    }

    getUser = ():void => {
        //return this.user;
        console.log("user service", this.dukeId);
        this.httpService.getUser(this.dukeId)
        .subscribe(data => {
            this.user = data;
            // for (let d of data) {
            // d.tagString = d["tag_string"];
            // d.tags = [];
            // d.refersTo = d["refers_to"];
            // d.areaKey = d["area_key"];
            // d.lastUpdatedBy = d["last_updated_by"];
            // d.lastUpdated = d["last_updated"];
            // delete d["refers_to"];
            // delete d["area_key"];
            // delete d["tag_string"];
            // delete d["created_by"];
            // delete d["last_updated"];
            // delete d["last_updated_by"];

            // d.display = true;
            });

       // this.acronymsService.setAcronyms(data);
        // this.acronyms = data;
       // this.acronyms = this.acronymsService.getAcronyms();
       // console.log("this.acronyms", this.acronyms);
    //}); // getUser

    }
    

    isUserAdmin = () => {
        console.log("user service isUserAdmin", this.user);
        if (this.user !== null) {
            return true;
        } else {
            return false;
        }
        //return this.user.isAdmin;
    }

    setUserAdmin = (isAdmin: boolean) => {
        this.user.isAdmin = true;
    }

}