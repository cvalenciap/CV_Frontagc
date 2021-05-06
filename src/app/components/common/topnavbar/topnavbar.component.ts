import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AppSettings } from '../../../app.settings';
declare var jQuery: any;
import { Router } from '@angular/router';
import { AuthService } from '../../../services/impl/auth.service';
import { TrustedString } from '@angular/core/src/sanitization/sanitization';
import {Credenciales} from '../../../models/credenciales';

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {
  public credenciales: Credenciales;
  nombre: string;
  nick: string;
  nombrePerfil: string;
  login: string;
  idPers: string;
  descOficina: string;
  perfilAsignado: number;

  constructor(private router: Router, private authService: AuthService) {
    this.nombre = AppSettings.APP_NAME;
    this.nick = sessionStorage.getItem('nombreTrabajador');
    this.nombrePerfil = sessionStorage.getItem('nombrePerfil');
    this.credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    this.login = this.credenciales.usuario;
    this.idPers = sessionStorage.getItem('codigoTrabajador');
    this.descOficina = sessionStorage.getItem('descOficina') != null && sessionStorage.getItem('descOficina') != "" ? sessionStorage.getItem('descOficina').toString() : 'NOF';
    this.perfilAsignado = +sessionStorage.getItem('perfilAsignado');
  }

  toggleNavigation(): void {
    jQuery('body').toggleClass('mini-navbar');
    smoothlyMenu();
  }

  logout(): void {
    this.authService.logout(this.credenciales.token);
    this.router.navigate(['/login']);
  }
}
