import {Observable} from 'rxjs';
import {Credenciales} from '../../models/credenciales';

export interface IAuthService {
  autenticar(credenciales: Credenciales): Observable<any>;
  crear(): Credenciales;
  logout(token: string): void;
  recuperarContrasena(usuario: string): Observable<any>;
  obtenerIP(mtoken : String): Observable<any>;
}
