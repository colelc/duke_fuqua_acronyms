import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  //return next(req);

  console.log("Outgoing HTTP request", request);
  const authReq = request.clone({
      withCredentials: true
  });

  console.log("authReq", authReq);

  //return next.handle(authReq);

  return next(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        console.log("Incoming HTTP response", event);
      })
    );
};
