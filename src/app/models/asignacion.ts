import { Actividad, Empresa, EstadoAsignacion, Zona } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class Asignacion {
    idCabecera: number;
    numeroCarga: string;
    contratista: Empresa;
    oficina: Oficina;
    actividad: Actividad;  
    fechaAsignacion: string;
    cantAsignada: number;
    cantProgramada: number;
    estadoAsignacion: EstadoAsignacion;
    
    avance:string;

  /*   constructor(){
      let number = (this.cantAsignada/this.cantProgramada)*100;
      console.log(number);
      this.avance = number.toFixed(2)
    } */

    
  }