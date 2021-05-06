import {Directive, Injectable, ɵConsole} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RepoInfActiEjec} from '../../models';
import {environment} from '../../../environments/environment';
import {Response} from '../../models/';
import {Observable, BehaviorSubject} from 'rxjs';
import { ProgramaMensualRequest } from '../../models/request/programa-mensual-request';
import { Credenciales } from 'src/app/models/credenciales';

@Injectable({
  providedIn: 'root',
})
export class ProgramaMensualService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public  isLoading$ = this.isLoading.asObservable();
  private apiEndpoint:string;

  constructor(private http:HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/reportes';
  }

  registrarPrograma(programaMensual:ProgramaMensualRequest): Observable<any> {
    const url = `${this.apiEndpoint}/programa-valores`;
    return this.http.post(url, programaMensual);
  }


}
