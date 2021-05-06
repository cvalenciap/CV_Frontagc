import { Injectable } from '@angular/core';
import { Credenciales } from '../models/credenciales';
import { Router } from '@angular/router';
import { Formulario, Modulo } from '../models/modulo';
import { AuthService } from '../services/impl/auth.service';
import { Response } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private expiresAt: number;
  private authenticated: boolean;
  private userProfile: Credenciales;
  private permissions: string[];
  private _expired: boolean;
  private modules: any;
  public accessToken: string;

  constructor(private router: Router,
              private authService: AuthService) {
    this.expiresAt = Number(sessionStorage.getItem('expiresIn')) * 60000 + Date.now();
    this.userProfile = JSON.parse(sessionStorage.getItem('credenciales'));
    this.permissions = null;
    this.modules = JSON.parse(sessionStorage.getItem('modulos'));
  }

  setSession(credential: Credenciales) {
    this.accessToken = credential.token;
    this.authenticated = true;
    sessionStorage.setItem('accessToken', credential.token);
  }

  validateExpiration(): void {
    const dateStart: Date = new Date();
    const dateEnd: Date = new Date(this.expiresAt);
    const dateDiff = dateStart.getTime() - dateEnd.getTime();
    const elapsedMinutes: number = Math.round(dateDiff / (1000 * 60));
    if (elapsedMinutes > Number(sessionStorage.getItem('expiresIn')) || elapsedMinutes === NaN) {
      this.expireSession();
      location.reload();
    } else {
      this._expired = false;
    }
  }

  validatePathEnter(nameModule: string): boolean {
    let booleanResponse = false;
    if (nameModule !== '/multiperfil') {
      const modules: Modulo[] = JSON.parse(sessionStorage.getItem('modulos'));
      if (modules !== null) {
        modules.forEach((module) => {
          const formularios = module.formularios;
          if (!booleanResponse) {
            formularios.forEach((formulario) => {
              if (!booleanResponse) {
                if (this.getPathTrust(formulario.url, nameModule)) {
                  booleanResponse = true;
                }
              }
            });
          }
        });
      }
    }
    return booleanResponse;
  }

  private getPathTrust(urlSecurity: string, path: string): boolean {
    let booleanResponse = true;
    for (let index = 0; index < urlSecurity.length; index++) {
      if (urlSecurity[index] !== path[index]) {
        booleanResponse = false;
      }
    }
    return booleanResponse;
  }

  updateExpiration() {
    // Update session expiration date
    this.expiresAt = Number(sessionStorage.getItem('expiresIn')) + Date.now();
  }

  expireSession() {
    this.deleteSession();
    this._expired = true;
  }

  deleteSession() {
    // remove user from local storage to log user out
    this.authenticated = false;
    this.accessToken = null;
    this.userProfile = null;
    this.expiresAt = null;
    this.permissions = null;
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('credenciales');
    sessionStorage.removeItem('modulos');
    sessionStorage.removeItem('codigoTrabajador');
    sessionStorage.removeItem('nombreTrabajador');
    sessionStorage.removeItem('estadoTrabajador');
    sessionStorage.clear();
  }

  public getAuthorities(): string[] {
    this.permissions = [];
    if (sessionStorage.getItem('accessToken')) {
      this.permissions = this.modules;
      this.permissions.push('/inicio');
      if (this.permissions.includes('/bandeja-entrada')) {
        this.permissions.push('/bandeja-entrada/recibidos');
        this.permissions.push('/bandeja-entrada/con-plazo');
      }
    }
    return this.permissions;
  }

  public validatePermission(permission: string): boolean {
    // Validar si usuario posee un permiso
    if (permission[0] !== '/') { permission = `/${permission}`; }
    const urls = this.getAuthorities();
    return urls.includes(permission);
  }

  get User() {
    // Return user profile
    return this.userProfile;
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    return (Date.now() < this.expiresAt) && this.authenticated;
  }

  get expired(): boolean {
    return this._expired;
  }

  controlarError(error) {
    console.log("ocurrio error");
  }

  /* mcortegana */
  public async renovarCredenciales() {
    this.userProfile = JSON.parse(sessionStorage.getItem('credenciales'));
    this.authService.autenticar(this.userProfile)
      .toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          const nuevasCredenciales: Credenciales = new Credenciales();
          nuevasCredenciales.usuario = this.userProfile.usuario;
          nuevasCredenciales.clave = this.userProfile.clave;
          nuevasCredenciales.token = response.resultado.token;
          sessionStorage.setItem('credenciales', JSON.stringify(nuevasCredenciales));
          sessionStorage.setItem('expiresIn', response.resultado.tiempoSesion);
          this.userProfile = nuevasCredenciales;
          this.expiresAt = Number(response.resultado.tiempoSesion) * 60000 + Date.now();
        } else {
          console.error('Error al intentar renovar token');
          console.error(response);
        }
      }).catch(err => {
      console.error('Error al intentar renovar token');
      console.error(err);
    });
  }
  /*  */

}
