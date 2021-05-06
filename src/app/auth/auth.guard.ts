import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionService} from './session.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router, private toastr: ToastrService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const path: string = state.url.toString();
    if (localStorage.getItem('isLoggedIn') && this.sessionService.expired) {
      this.router.navigate(['/login']);
      return false;
    }
    if (!this.sessionService.validatePathEnter(path)) {
      if (sessionStorage.getItem('modulos') !== null) {
        this.router.navigate(['/inicio']);
      } else {
        this.router.navigate(['/login']);
      }
      this.toastr.error('No puede ingresar al path: ' + path, 'Control de seguridad', {closeButton: true});
      return false;
    }
    return true;
  }

}
