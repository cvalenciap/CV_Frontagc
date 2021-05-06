import { Paginacion } from 'src/app/models';

export default class PaginacionUtil {

  public static devolverPaginacion(paginacion: Paginacion, tamanioArray: number): Paginacion {
    return (paginacion !== null && paginacion !== undefined) ? paginacion : new Paginacion({ pagina: 1, registros: 10, totalRegistros: tamanioArray });
  }

  public static devolverPagina(paginacion: Paginacion): number {
    return (paginacion !== null && paginacion !== undefined) ? paginacion.pagina : 0;
  }

  public static devolverNroRegistros(paginacion: Paginacion): number {
    return (paginacion !== null && paginacion !== undefined) ? paginacion.registros : 0;
  }

  public static paginarData(fullArray: Array<any>, paginacion: Paginacion): any[] {
    const inicio = (paginacion.pagina - 1) * paginacion.registros;
    const fin = paginacion.pagina * paginacion.registros;
    return fullArray.slice(inicio, fin);
  }

  public static paginacionVacia(registros: number = 10): Paginacion {
    return new Paginacion({ pagina: 1, registros: registros, totalPaginas: 0, totalRegistros: 0 });
  }

  public static paginacionCero(): Paginacion {
    return new Paginacion({ pagina: 0, registros: 0 });
  }

  public static recuperarPaginacionSession(paginacionSession: any) {
    return new Paginacion({
      pagina: paginacionSession._pagina, registros: paginacionSession._registros,
      totalRegistros: paginacionSession._totalRegistros, totalPaginas: paginacionSession._totalPaginas
    });
  }

}
