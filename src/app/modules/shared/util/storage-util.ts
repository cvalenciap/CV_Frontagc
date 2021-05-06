export default class StorageUtil {

  public static almacenarObjetoSession(value: any, key: string): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public static almacenarPrimitivoSession(value: any, key: string): void {
    sessionStorage.setItem(key, value);
  }

  public static recuperarObjetoSession(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }

  public static recuperarPrimitivoSession(key: string): any {
    return sessionStorage.getItem(key);
  }

  public static removerSession(key: string): void {
    sessionStorage.removeItem(key);
  }

}
