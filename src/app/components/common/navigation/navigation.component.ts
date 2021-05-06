import { Component, AfterViewInit, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import { AuthService } from '../../../services/impl/auth.service';
import { Menu } from '../../../models/menu';
import { Modulo } from '../../../models/modulo';
import { Credenciales } from '../../../models/credenciales';

declare var jQuery: any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private authService: AuthService) {}
  menu: Menu;
  modulo: Modulo;
  item: Credenciales;
  ngOnInit() {
    let  credenciales : string;
    credenciales = sessionStorage.getItem("credenciales");
    this.item  = JSON.parse(credenciales);
    this.modulo = JSON.parse(sessionStorage.getItem('modulos'));
    this.getMenu();
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery('body').hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      });
    }
  }

  getMenu(){
    const this_= this;
    let array=[]; 
    
    for (let i in this.modulo){
      /* console.log(this.modulo[i].formularios); */
      for(let j in this.modulo[i].formularios){
      
        /*let map = {}, node, roots = [], k;
            for (k = 0; k< array.length; k += 1) {
              map[array[k].codigo] = k; // initialize the map
              array[k].child = []; // initialize the children
              }
            for (k = 0;k < array.length; k += 1) {
              node = array[k];
              if (node.codigoPadre !== 0) {
                  // if you have dangling branches check that map[node.parentId] exists
                  array[map[node.codigoPadre]].child.push(node);
                 
                    // array[map[1]].child.push(node);
              } else {
                  roots.push(node);
              }  
          }*/
         // console.log(array);
      }
    }

    //console.log(roots);
  }
  


  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  logout(token: string): void {
    this.authService.logout(token);
    this.router.navigate(['/login']);
  }

  proper(cadena: string) {
    cadena = cadena.toLowerCase();
    var arreglo = cadena.split(' ');
    let nuevaCad = '';
    for(let i=0;i<=arreglo.length - 1;i++) {
      if(arreglo[i].length>2) {
        nuevaCad = nuevaCad + ' ' + arreglo[i].substr(0,1).toUpperCase() + arreglo[i].substr(1,arreglo[i].length - 1);
      } else {
        nuevaCad = nuevaCad + ' ' + arreglo[i];
      }
    }
    return (nuevaCad).trim();
  }


  //
  session(){
    //busqueda avanzada
    localStorage.removeItem('ContratistaFinal');
    localStorage.removeItem('EstadoFinal');
    localStorage.removeItem('ActividadFinal');
    localStorage.removeItem("OficinaFinal");
    //busqueda avanzada
    localStorage.removeItem("FinalBusqueda");
    localStorage.removeItem("ParametroBusquedad");
    localStorage.removeItem("Variable");
    localStorage.removeItem("parametroBusqueda");
    //////////
    localStorage.removeItem("busquedatextofina");
    localStorage.removeItem("flagBusqueda");
    localStorage.removeItem("textoBusqueda");
    localStorage.removeItem("flagBusqueda");
    //////
    localStorage.removeItem("texfinal");
    localStorage.removeItem("paraFinal");
    //pagina
    localStorage.removeItem("CantPagina");
    localStorage.removeItem("PaginaFinal");
    //estado
    localStorage.removeItem("Desestado");
    sessionStorage.removeItem("valorFin");
    sessionStorage.removeItem("estadoParametroF");
    sessionStorage.removeItem("tipoEstadoF");
    sessionStorage.removeItem("ValorFInal");
    sessionStorage.removeItem("busquedaAvanzadaFinal");
    //Busqueda y paginacion
    localStorage.removeItem("busquePagin")
    // final
    sessionStorage.removeItem("tex")
    sessionStorage.removeItem("parametroBusqueda")
    sessionStorage.removeItem("valorEstado")  
    localStorage.removeItem("pagRetorno"); 
    localStorage.removeItem('contratista');
    sessionStorage.removeItem("busquedaAvanzadaprimero")
    localStorage.removeItem('actividadmensaje');
    localStorage.removeItem("oficinaFinalC");
    sessionStorage.removeItem("busquedaAvanzadaFinal")
    localStorage.removeItem('estadoAvanza');
    localStorage.removeItem('EstadoMensaje');
    localStorage.removeItem('combocantidadRow');
    
  }

}
