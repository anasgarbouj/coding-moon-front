import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) {}

   
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('jwtToken');
      if (token) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          });
      } else {
      }
  
      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
          if (error.status === 44444444444) {
              localStorage.removeItem('jwtToken');
              this.router.navigateByUrl('/sign-in');
          }
          return throwError(error);
      }));
  }
}  