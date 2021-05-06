import {IAuthService} from '../interfaces/iatuh.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Credenciales, ActualizarClave } from '../../models/credenciales';
import { Response } from '../../models/response';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  'Accept': 'application/json' })
};


@Injectable({
  providedIn: 'root',
})

export class AuthService implements IAuthService {
  private apiEndpoint: string;
  private apiHeadersEndpoint: string;
  private toastr: ToastrService;

  constructor(private http: HttpClient, private router: Router) {
    this.apiEndpoint = environment.serviceEndpoint + '/api/credenciales';
     this.apiHeadersEndpoint = environment.headersEndpoint;
  }

  autenticar(credenciales: Credenciales){
    /**
     * borrar*/
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': ''
      })
    };
     /**/
    const url = `${this.apiEndpoint}/login`;
    return this.http.post(url, credenciales, httpOptions);
  }

  obtenerTrabajador(usuario: string) {
    return this.http.get(`${this.apiEndpoint}/trabajador/${usuario}`, httpOptions);
  }

  obtenerPersonal(usuario: string){
    return this.http.get(`${this.apiEndpoint}/personal/${usuario}`, httpOptions);
  }

  obtenerMenuSistema(credenciales: Credenciales) {
    const url = `${this.apiEndpoint}/modulos`;
    return this.http.post(url, credenciales);
  }

  crear(): Credenciales {
    const credenciales = new Credenciales();
    return credenciales;
  }

  logout(token: string): void {
    if (token !== '') {
      this.validarToken(token).subscribe(
        (response: Response) => {
          if (response.estado === 'OK') {
            sessionStorage.setItem('isLoggedIn', 'false');
          }
        },
        (error) => this.controlarError(error)
      );
    }
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('perfiles');
    sessionStorage.removeItem('modulos');
    sessionStorage.removeItem('credenciales');
    sessionStorage.removeItem('codigoTrabajador');
    sessionStorage.removeItem('nombreTrabajador');
    sessionStorage.removeItem('estadoTrabajador');
    sessionStorage.removeItem('EmpresaUsuarioSesion');
    sessionStorage.clear();
  }

  validarToken(token: string) {
    return this.http.get(`${this.apiEndpoint}/token/${token}`, httpOptions);
  }

  recuperarContrasena(usuario: string) {
    return this.http.get(`${this.apiEndpoint}/${usuario}`, httpOptions);
  }

  cambiarContrasena(credenciales: ActualizarClave ) {
    return this.http.post(`${this.apiEndpoint}/actualizar`, credenciales, httpOptions);
  }

  controlarError(error) {
    const message = (error.error instanceof ErrorEvent) ? error.error.message : `${error.error.error.mensaje}`;
    sessionStorage.setItem('isLoggedIn', 'false');
    this.toastr.error(message, 'Error', {closeButton: true});
  }

  obtenerIP(mtoken: String): Observable<any> {         
    return this.http.get(this.apiHeadersEndpoint, {headers: {'Authorization':`${mtoken}`}});

  }

}
