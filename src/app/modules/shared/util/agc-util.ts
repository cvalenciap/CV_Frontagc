export default class AgcUtil {

  public static patternEmail: RegExp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  public static patterDNI: RegExp = /^\d{8}(?:[-\s]\d{4})?$/;
  public static patternGetExtencionFile: RegExp = /(?:\.([^.]+))?$/;

  public static esperar(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static ObjectToArray(data: any): Array<any> {
    if (Array.isArray(data)) {
      return data;
    } else {
      return Array.of(data);
    }
  }

  public static validarCampoObjeto(value: any): boolean {
    return (value !== null && value !== undefined);
  }

  public static validarCampoTexto(value: string): boolean {
    if (value !== undefined && value !== null) {
      return value.trim() !== '';
    }
    return false;
  }

  public static padStart(word: string, targetLength: number, padString: string) {
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (word.length > targetLength) {
      return String(word);
    } else {
      targetLength = targetLength - word.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(word);
    }
  }

}
