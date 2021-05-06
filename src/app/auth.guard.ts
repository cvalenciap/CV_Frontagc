import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(activatedRourete: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.verifyLogin();
    }

    verifyLogin(): boolean {
        if (!this.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        } else if (this.isLoggedIn()) {
            return true;
        }
    }
    public isLoggedIn(): boolean {
        let status = false;
        if (localStorage.getItem('isLoggedIn') === 'true') {
          status = true;
        } else {
          status = false;
        }
        return status;
    }
}
