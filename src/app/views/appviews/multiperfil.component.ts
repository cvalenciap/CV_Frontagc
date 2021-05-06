import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/impl/auth.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Credenciales } from '../../models/credenciales';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Alert } from '../../models/alert';
import { PerfilSistema } from '../../models';
import { Response } from '../../models/response';
import { PerfilSedapal } from 'src/app/models/enums';
import {AppSettings} from '../../app.settings';
import { OficinasService } from 'src/app/services/impl/oficinas.service';
import { AccionesService } from '../../services/impl/acciones-service';
import {Parametro as EnumParametro} from '../../models/enums/parametro';

@Component({
  selector: 'app-multiperfil',
  templateUrl: 'multiperfil.component.html',
  providers: [AuthService]
})
export class MultiperfilComponent implements OnInit {
  public copyright: string;
  public version: string;
  public id: string;
  item: Credenciales;
  alerts: Alert[];
  messageAlert: boolean;
  loading: boolean;
  error: string;
  perfiles : any[];
  menu: any[];

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: AuthService,
              private accionesService: AccionesService,
              private oficinaService: OficinasService) {

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.messageAlert = false;

    let listaPerfiles: string;
    listaPerfiles = sessionStorage.getItem('perfiles');
    this.perfiles = JSON.parse(listaPerfiles);

  }

  addErrorAlert = function (text: string) {
    this.limpiarAlertas();
    const alert = new Alert();
    alert.msg = text;
    alert.type = 'danger';
    this.alerts.push(alert);
  };

  closeErrorAlert = function (index: number) {
    this.alerts.splice(index, 1);
  };

  limpiarAlertas = function () {
    this.alerts = [];
  };

  ngOnInit() {
    this.item = this.service.crear();
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.id = AppSettings.APP_ID;
    this.version = AppSettings.APP_VERSION;
  }

  OnIniciarSesion(form: NgForm) {
    if (form.value.perfiles) {
      let nombrePerfil = '';
      for (let i = 0; i < this.perfiles.length; i++) {
        if (this.perfiles[i].codigo == form.value.perfiles) {
          nombrePerfil = this.perfiles[i].descripcion;
          break;
      }
    }

      let credenciales: string;
      credenciales = sessionStorage.getItem('credenciales');

      this.item = JSON.parse(credenciales);
      this.item.perfil = form.value.perfiles;
      sessionStorage.setItem('perfilAsignado', form.value.perfiles);
      sessionStorage.setItem('nombrePerfil', nombrePerfil)
      this.service.obtenerMenuSistema(this.item).subscribe(
        (response: Response) => {
          if (response.estado === 'OK') {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('modulos', JSON.stringify(response.resultado.modulos));
            sessionStorage.setItem('permisos', JSON.stringify(response.resultado.permisos));
            // Datos del trabajador
            if (this.item.perfil == EnumParametro.PERFIL_ANALISTA_EXTERNO || this.item.perfil == EnumParametro.PERFIL_SUPERVISOR_EXTERNO) {
              this.service.obtenerPersonal(this.item.usuario).subscribe(
                (responseTrabajador: Response) => {
                  if (responseTrabajador.estado === 'OK') {
                    sessionStorage.setItem('codigoTrabajador', responseTrabajador.resultado.codigo);
                    sessionStorage.setItem('nombreTrabajador', responseTrabajador.resultado.nombre);
                    sessionStorage.setItem('estadoTrabajador', responseTrabajador.resultado.estado);
                    this.oficinaService.retornarOficinaLogin(responseTrabajador.resultado.codigo).subscribe(
                      (responseOficina: Response) => {
                        sessionStorage.setItem('codOficina', responseOficina.resultado.codigo);
                        sessionStorage.setItem('descOficina', responseOficina.resultado.descripcion);
                        this.accionesService.consultarPermisos(+sessionStorage.getItem('perfilAsignado')).subscribe(
                          (responseAccion: Response) => {
                            sessionStorage.setItem('acciones', responseAccion.resultado);
                            this.router.navigate(['inicio']);
                          },
                          (error) => {
                            sessionStorage.setItem('acciones', '');
                            this.router.navigate(['inicio']);
                          }
                        );
                      },
                      (error) => {
                        this.controlarError(error);
                        this.router.navigate(['inicio']);
                      }
                    );
                } else{
                  this.toastr.error(responseTrabajador.error.mensajeInterno, 'Error', {closeButton: true});
                }
              },
              (error) => this.controlarError(error)
            );
          }else{
            this.service.obtenerTrabajador(this.item.usuario).subscribe(
              (responseTrabajador: Response) => {
                if (responseTrabajador.estado === 'OK') {
                  sessionStorage.setItem('codigoTrabajador', responseTrabajador.resultado.codigo);
                  sessionStorage.setItem('nombreTrabajador', responseTrabajador.resultado.nombre);
                  sessionStorage.setItem('estadoTrabajador', responseTrabajador.resultado.estado);

                    if (this.item.perfil == EnumParametro.PERFIL_ANALISTA_INTERNO || this.item.perfil == EnumParametro.PERFIL_RESPONSABLE ||
                      this.item.perfil == EnumParametro.PERFIL_ADMINISTRADOR_OFICINA || this.item.perfil == EnumParametro.PERFIL_CONS_GEN) {
                      this.oficinaService.retornarOficinaLogin(responseTrabajador.resultado.codigo).subscribe(
                        (responseOficina: Response) => {
                          sessionStorage.setItem('codOficina', responseOficina.resultado.codigo);
                          sessionStorage.setItem('descOficina', responseOficina.resultado.descripcion);
                          this.accionesService.consultarPermisos(+sessionStorage.getItem('perfilAsignado')).subscribe(
                            (responseAccion: Response) => {
                              sessionStorage.setItem('acciones', responseAccion.resultado);
                              this.router.navigate(['inicio']);
                            },
                            (error) => {
                              sessionStorage.setItem('acciones', '');
                              this.router.navigate(['inicio']);
                            }
                          );
                        },
                        (error) => {
                          this.controlarError(error);
                          this.router.navigate(['inicio']);
                        }
                      );
                    } else {
                      this.accionesService.consultarPermisos(+sessionStorage.getItem("perfilAsignado")).subscribe(
                        (responseAccion: Response) => {
                          sessionStorage.setItem("acciones", responseAccion.resultado);
                          this.router.navigate(['inicio']);
                        },
                        (error) => {
                          sessionStorage.setItem("acciones", "");
                          this.router.navigate(['inicio']);
                        }
                      )
                    }
                  }
                },
                (error) => this.controlarError(error)
              );
            }
          } else {
            sessionStorage.setItem('isLoggedIn', 'false');
            sessionStorage.setItem('modulos', '');
            this.router.navigate(['login']);
          }
        },
        (error) => this.controlarError(error)
      );
      sessionStorage.setItem('isLoggedIn', 'true');

    } else {
      this.toastr.error('Debe seleccionar un perfil.', 'Error', { closeButton: true });
    }
  }

  controlarError(error) {
    const message = (error.error instanceof ErrorEvent) ? error.error.message : `${error.error.error.mensaje}`;
    sessionStorage.setItem('isLoggedIn', 'false');
    this.toastr.error(message, 'Error', {closeButton: true});
  }
}
