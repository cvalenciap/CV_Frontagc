import { IDigitalizado } from "src/app/services/interfaces/iDigitalizados.service";
import { Injectable } from "@angular/core";
import { FiltrosBandejaDigitalizados } from "src/app/models/filtro-bandeja.digitalizado";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpParams } from "@angular/common/http";
import { ILogDigitalizado } from "src/app/services/interfaces/iLogDigitalizado.service";
import { FiltrosBandejaLog } from "src/app/models/filtro-bandeja.log";
import { DatePipe } from "@angular/common";

@Injectable({
    providedIn: 'root'
  })
export class LogDigitalizadoService implements ILogDigitalizado {    

    private apiEndpoint: string;

    constructor(private httpClient: HttpClient,
                private datePipe: DatePipe) {
                this.apiEndpoint = environment.serviceEndpoint + '/logDigitalizado';
      }
    
    obtenerLogDigitalizados(request: FiltrosBandejaLog, pagina: number, registros: number) {
        const url = `${this.apiEndpoint}/logDigitalizados`;

        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        
        return this.httpClient.post(url, request, {params});
    }

    generarArchivoExcelLogDigitalizados(request: FiltrosBandejaLog, pagina: number, registros: number) { 
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());

        if(request.suministro){params = params.set('suministro', request.suministro.toString());}
        if(request.usuario){params = params.set('usuario', request.usuario);}
        if(request.tipoAccion){params = params.set('tipoAccion', request.tipoAccion);}

        let fecInicio: string;
        let fecFin: string;
        if(request.fechaInicio){fecInicio = this.datePipe.transform(request.fechaInicio, 'dd-MM-yyyy').toString()}else{fecInicio = "NULO"};
        if(request.fechaFin){fecFin = this.datePipe.transform(request.fechaFin, 'dd-MM-yyyy').toString()}else{fecFin = "NULO"};

        const url = `${this.apiEndpoint}/logDigitalizados.excel/${fecInicio}/${fecFin}`;

        return this.httpClient.get(url, {responseType: 'arraybuffer', params: params});
    }

}