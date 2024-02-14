import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({providedIn: "root"})
export class ConfigService {

    //static URL_GET_ACRONYM: string = "https://some/get/url/";
    //static URL_POST_ACRONYM: string = "https://some/post/url/";
    static API_BASE = environment.apiBase;

    constructor() { }




}