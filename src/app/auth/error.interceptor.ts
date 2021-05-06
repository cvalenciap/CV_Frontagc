import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../services/impl/auth.service';
import {SessionService} from './session.service';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Error} from '../models/response';

@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private sessionService: SessionService, private router: Router,
              private toastr: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.body !== null) {
            if (evt.body.estado === 'ERROR') {
              if (evt.url.includes('/asignacion-personal')) {
                this.toastr.error(evt.body.error.mensaje, 'Error:');
              }
            }
          }
        }
      }),
      catchError(error => {
      if (error.status === 401 || error.status === 403) {
        this.sessionService.expireSession();
        this.authService.logout('');
          this.router.navigate(['/login']);
        this.toastr.error('No se cuenta con permisos necesarios.', 'Error generación token', {closeButton: true});
      }
      return throwError(error);
    }));
  }

}
