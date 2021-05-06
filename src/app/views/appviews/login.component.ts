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
import { Response } from '../../models/response';
import {RequestParametro} from '../../models/request/request-parametro';
import {ParametrosService} from '../../services/impl/parametros.service';
import {Parametro} from '../../models';
import {AppSettings} from '../../app.settings';
import { OficinasService } from 'src/app/services/impl/oficinas.service';
import { ViewChild } from '@angular/core';
import { AccionesService } from '../../services/impl/acciones-service';
import {Parametro as EnumParametro} from '../../models/enums/parametro';
import { environment } from 'src/environments/environment';
import { EmpresasService } from 'src/app/services/impl/empresas.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.template.html',
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  public copyright: string;
  public version: string;
  public id: string;
  item: Credenciales;
  alerts: Alert[];
  messageAlert: boolean;
  loading: boolean;
  error: string;

  constructor(private localeService: BsLocaleService, private parametroService: ParametrosService, private toastr: ToastrService,
              private router: Router,
              private service: AuthService,
              private accionesService: AccionesService,
              private oficinaService: OficinasService,
              private empresasService: EmpresasService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.messageAlert = false;
    this.loading = false;
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
    this.item.usuario = form.value.usuario;
    // this.item.clave = form.value.clave;
    this.loading = true;
    this.service.autenticar(this.item).subscribe(
      (response: Response) => {
        if (response.estado === 'OK') {
          sessionStorage.setItem('isLoggedIn', 'true');
          this.item.token = response.resultado.token;
          sessionStorage.setItem("TOKEN", response.resultado.token);
          sessionStorage.setItem("SERVICEENDPOINT", environment.serviceEndpoint);

          this.service.obtenerIP(this.item.token).subscribe(
            (response: Response) => {
              sessionStorage.setItem('IP', response.resultado);
            },
            (error) => this.controlarError(error)
          );

          sessionStorage.setItem('credenciales', JSON.stringify(this.item));
          sessionStorage.setItem('expiresIn', response.resultado.tiempoSesion);

          if (response.resultado.numPerfilesActivos > 1) {
            sessionStorage.setItem('perfiles', JSON.stringify(response.resultado.perfiles));
            this.router.navigate(['multiperfil/' + this.item.usuario]);
          } else if (response.resultado.numPerfilesActivos === 1 ) {
            if (response.resultado.numPerfilesActivos > 1) {
              sessionStorage.setItem('perfiles', JSON.stringify(response.resultado.perfiles));
              sessionStorage.setItem('perfilAsignado', response.resultado.perfiles[0].codigo);
              this.router.navigate(['multiperfil/' + this.item.usuario]);
            } else if (response.resultado.numPerfilesActivos === 1) {
              this.item.perfil = response.resultado.perfiles[0].codigo;
              const nombrePerfil = response.resultado.perfiles[0].descripcion;
              sessionStorage.setItem('perfilAsignado', response.resultado.perfiles[0].codigo);
              sessionStorage.setItem('nombrePerfil', nombrePerfil);
              // Obtener listado de opciones del Sistema de acuerdo al perfil
              this.service.obtenerMenuSistema(this.item).subscribe(
                (responseMenu: Response) => {
                  if (response.estado === 'OK') {
                    sessionStorage.setItem('modulos', JSON.stringify(responseMenu.resultado.modulos));
                    sessionStorage.setItem('permisos', JSON.stringify(responseMenu.resultado.permisos));
                    // Datos del trabajador
                    if(this.item.perfil == EnumParametro.PERFIL_ANALISTA_EXTERNO || this.item.perfil == EnumParametro.PERFIL_SUPERVISOR_EXTERNO){
                      this.service.obtenerPersonal(this.item.usuario).subscribe(
                        (responseTrabajador: Response) => {
                          this.loading=false;
                          if (responseTrabajador.estado === 'OK') {
                            sessionStorage.setItem('codigoTrabajador', responseTrabajador.resultado.codigo);
                            sessionStorage.setItem('nombreTrabajador', responseTrabajador.resultado.nombre);
                            sessionStorage.setItem('estadoTrabajador', responseTrabajador.resultado.estado);
                            this.empresasService.listarEmpresaPersonal(responseTrabajador.resultado.codigo).subscribe(
                              (responseEmpresa: Response) => {
                                sessionStorage.setItem("codEmpresa", responseEmpresa.resultado.codigo);
                                sessionStorage.setItem("descEmpresa", responseEmpresa.resultado.descripcion);                                
                              },
                              (error)=>{
                                this.controlarError(error);
                              }
                            );
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
                                  });
                                this.router.navigate(['inicio']);
                              },
                              (error) => {
                                this.controlarError(error);
                                this.router.navigate(['inicio']);
                              }
                            );
                          }else{
                            this.toastr.error(responseTrabajador.error.mensajeInterno, 'Error', {closeButton: true});
                          }
                        },
                        (error) => this.controlarError(error)
                      );
                    }else{
                      this.service.obtenerTrabajador(this.item.usuario).subscribe(
                        (responseTrabajador: Response) => {
                          this.loading=false;
                          if (responseTrabajador.estado === 'OK') {
                            sessionStorage.setItem('codigoTrabajador', responseTrabajador.resultado.codigo);
                            sessionStorage.setItem('nombreTrabajador', responseTrabajador.resultado.nombre);
                            sessionStorage.setItem('estadoTrabajador', responseTrabajador.resultado.estado);

                           if(this.item.perfil == EnumParametro.PERFIL_ANALISTA_INTERNO || this.item.perfil == EnumParametro.PERFIL_RESPONSABLE ||
                              this.item.perfil == EnumParametro.PERFIL_ADMINISTRADOR_OFICINA ||  this.item.perfil == EnumParametro.PERFIL_CONS_GEN){
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
                                  });
                                this.router.navigate(['inicio']);
                              },
                              (error) => {
                                this.controlarError(error);
                                this.router.navigate(['inicio']);
                              }
                            );
                         }else{
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
                            this.router.navigate(['inicio']);
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
            }
          }
        } else {
          this.loading = false;
          this.toastr.error('Error en el Servicio de Autenticación', 'Error', {closeButton: true});
          sessionStorage.setItem('isLoggedIn', 'false');
          sessionStorage.setItem('perfiles', '');
          this.router.navigate(['login']);
        }
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    const message = (error.error instanceof ErrorEvent) ? error.error.message : `${error.error.error.mensaje}`;
    sessionStorage.setItem('isLoggedIn', 'false');
    this.toastr.error(message, 'Error', {closeButton: true});
    if (this.loading) {
        this.loading = false;
    }
  }
}
