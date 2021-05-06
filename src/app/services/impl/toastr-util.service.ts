import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';

@Injectable({
  providedIn: 'root'
})
export class ToastrUtilService {

  constructor(private toastr: ToastrService) { }

  public showSuccess(mensaje: string) {
    this.toastr.success(mensaje, Mensajes.CAB_MESSAGE_OK, { closeButton: true });
  }

  public showError(mensaje: string) {
    this.toastr.error(mensaje, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
  }

  public showWarning(mensaje: string) {
    this.toastr.warning(mensaje, Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
  }

}
