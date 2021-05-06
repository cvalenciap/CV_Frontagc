import { Component, OnInit, ViewChild, Output, Input, ɵConsole } from '@angular/core';
import { ParametrosCargaBandeja, Ciclos, Paginacion,Response, Oficina, CiclosDetalle} from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { CicloRequest } from 'src/app/models/request/ciclo-request';
import { CicloService } from '../../../services/impl/ciclo.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfilService } from 'src/app/services/impl/perfil.service';

@Component({
  selector: 'app-ciclos',
  templateUrl: './ciclos.component.html',
  styleUrls: ['./ciclos.component.scss']
})
export class CiclosComponent implements OnInit {
  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  oficina: number;
  periodo: string;
  loading: boolean;
  isLoading: boolean = false;
  @Input()
  items: Array<Ciclos> = new Array<Ciclos>();
  itemsDetalle: CiclosDetalle[];
  urlReportePdf: string;
  codigoPerfil: number;
  myForm: FormGroup;
  mes: number;
  mesTxt: string;
  anio: number;
  estadoLista: boolean;
  inicioBoton: boolean;
  closeResult: String = '';
  @Output()
  parametros: any;
  @Output()
  parametrosCiclo: any;
  @ViewChild('registrar') registrarModal: SwalComponent;
  @ViewChild(`detalle`) private detalleModal: SwalComponent;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private cicloService: CicloService,
    private perfil: PerfilService) { }

  ngOnInit() {
    this.consultarParametros();
    this.oficina = this.lista.oficinas[0].codigo;
    this.items = [];
    this.estadoLista = false;
    this.inicioBoton = false;
    this.mes = (new Date()).getMonth() + 1;
    this.mesTxt = this.mes<9?'0'+''+this.mes:''+this.mes;
    this.anio = (new Date()).getFullYear();
    this.myForm = this.fb.group({
      periodoCiclo: { year: this.anio, month: this.mesTxt }
    })
    this.periodo = this.anio + this.mesTxt;
    this.parametros = {idOficina: this.lista.oficinas[0].codigo,year:this.anio,month:this.mesTxt};
    this.parametros = JSON.stringify(this.parametros);

  }

  private consultarParametros() {
    this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
  }

  OnFiltrar() {
    this.isLoading = true;
    const this_ = this;
    const request: CicloRequest = new CicloRequest();
    const n_idofic = this.oficina == 0 ? null : this.oficina;
    const d_periodo = this.periodo == '' ? null : this.periodo;
    this.cicloService.obtenerCiclos(d_periodo,n_idofic).subscribe(
      (response: Response) => {
        this.items = (response.resultado) as Array<Ciclos>;
        console.log(this.items);
        this_.isLoading = false;
        if(this.items.length>0){
          this_.estadoLista = true;
          this_.inicioBoton = false;
        }else{
          this_.inicioBoton = true;
          this_.estadoLista = false;
        }
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }

  OnLimpiar() {
    this.consultarParametros();
    this.oficina = this.lista.oficinas[0].codigo;
    this.items = [];
    this.estadoLista = false;
    this.inicioBoton = false;
  }


  private suscribirLoading(): void {
    this.cicloService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
  }

  onPerriodoI($event) {
    this.periodo = $event.substring(3, 7) + $event.substring(0, 2);
    this.parametros = JSON.parse(this.parametros);
    this.parametros.year = $event.substring(3, 7) ;
    this.parametros.month = $event.substring(0, 2);
    this.parametros = JSON.stringify(this.parametros);

  }


  controlarError(err) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }

  OnChange(event) {
    this.parametros = JSON.parse(this.parametros);
    this.parametros.idOficina = event;
    this.parametros = JSON.stringify(this.parametros);
  }
  onCancelRegistrar() {
    this.registrarModal.nativeSwal.close();
    this.OnFiltrar(); 
  }
  OnDetalle(i){
    const this_ = this;
    const idciclo = this.items[i].n_idciclo;
    this.cicloService.obtenerCiclosLista(idciclo).subscribe(
      (response: Response) => {
        this_.itemsDetalle = (response.resultado) as Array<CiclosDetalle>;
        this_.isLoading = false;
        this_.detalleModal.show();
        this_.parametrosCiclo = {itemsDetalle:  this_.itemsDetalle,idCiclo: idciclo,itemActividad: this.listaParametros.listaActividad};
        this_.parametrosCiclo = JSON.stringify(this.parametrosCiclo);

      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }
  OnEliminar(i){
    const request = new CicloRequest();
    request.n_idciclo = this.items[i].n_idciclo;
    request.a_v_usumod = this.perfil.obtenerUsuarioLogin();
    this.cicloService.eliminarCiclo(request).subscribe(
      (response: Response) => {
        this.OnFiltrar(); 
        this.toastr.success('Confirmación', 'Registros agregados correctamente', {closeButton: true});
      },
      (error) => this.controlarError(error)
    );
  }

  listarItems(event) {
    this.items = event;
    this.isLoading = false;
    if(this.items.length>0){
      this.estadoLista = true;
    }else{
      this.inicioBoton = true;
    }
  }
}
