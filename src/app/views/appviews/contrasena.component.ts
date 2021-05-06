import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/impl/auth.service';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {Credenciales} from '../../models/credenciales';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {ToastrService} from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Response } from '../../models/response';
import {AppSettings} from '../../app.settings';

@Component({
  selector: 'app-contrasena',
  templateUrl: 'contrasena.component.html',
  providers: [AuthService]
})
export class ContrasenaComponent implements OnInit {
  public copyright: string;
  public version: string;
  public id: string;
  loading: boolean;
  item: Credenciales;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: AuthService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.item = this.service.crear();
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.id = AppSettings.APP_ID;
    this.version = AppSettings.APP_VERSION;
  }

  onRecuperarContrasena(form: NgForm) {
    let usuario: '';
    usuario = form.value.usuario;
    this.loading=true;
    this.service.recuperarContrasena(usuario).subscribe(
      (response: Response) => {
        this.loading = false;
        this.toastr.success('Se envió el correo con su nueva clave', 'Aviso', { closeButton: true });
        this.router.navigate(['cambiar-contrasena/' + usuario]);
      },
      (error) => {
        this.loading=false;
        this.controlarError(error);
      }
    );
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}
