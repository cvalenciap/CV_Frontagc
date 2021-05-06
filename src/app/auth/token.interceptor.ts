import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SessionService} from './session.service';

@Injectable({providedIn: 'root'})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authRequest = req;
    const credential = JSON.parse(sessionStorage.getItem('credenciales'));

    if (credential) {
      this.sessionService.validateExpiration();
      authRequest = req.clone({headers: req.headers.set('Authorization', `Bearer ${credential.token}`)});
    }

    return next.handle(authRequest);
  }

}
