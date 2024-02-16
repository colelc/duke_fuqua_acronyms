import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpService } from "../service/http.service";

//@Injectable({providedIn: "root"})
@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(private httpService: HttpService) {
        console.log("AuthInterceptor constructor");
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("We are intercepting!");
        //throw new Error("Method not implemented.");
        const authReq = req.clone({
            withCredentials: true
        });
        console.log("authReq", authReq);
        return next.handle(authReq);
    }
    
}