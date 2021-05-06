import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/impl/auth.service';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import { ActualizarClave } from '../../models/credenciales';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {ToastrService} from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Response } from '../../models/response';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-cambiar',
  templateUrl: 'cambiar.component.html',
  providers: [AuthService]
})

export class CambiarContrasenaComponent implements OnInit {

  item: ActualizarClave;
  usuario: string;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: AuthService,
              private route: ActivatedRoute) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.route.params
      .subscribe(
        (params: Params) => {
          this.usuario = params['usuario'];
        });
  }

  ngOnInit() {
    this.item = new ActualizarClave();
  }

  onCambiarContrasena(form: NgForm) {
      this.item.claveActual = form.value.claveActual;
      this.item.nuevaClave = form.value.claveNueva;
      this.item.nuevaClaveR = form.value.claveNueva;
      this.item.usuario = this.usuario;

      this.service.cambiarContrasena(this.item).subscribe(
        (response: Response) => {
          this.toastr.success(response.resultado);
          this.router.navigate(['login']);
        },
        (error) => this.controlarError(error)
      );
  }

  controlarError(error) {
    const message = (error.error instanceof ErrorEvent) ? error.error.message : `${error.error.error.mensaje}`;
    this.toastr.error(message, 'Error', {closeButton: true});
  }
}
