export const environment = {
  production: true,

  // RUTA DEL SERVICIO AGC
  //serviceEndpoint: 'http://localhost:8082',
  serviceEndpoint: 'http://apitra.sedapal.com.pe/agc_monitoreo',
  //serviceEndpoint: 'http://apin1qa.sedapal.com.pe/sedapal-agc_monitoreo-servicio',
  //serviceEndpoint: 'http://apisdpdesa01.sedapal.com.pe/agc',

  // RUTA DE LA APLICACION FILE SERVER
  //  fileServerServiceEndpoint: 'http://10.240.147.142:8080/fileserver/agc',
  fileServerServiceEndpoint: 'http://apin1qa.sedapal.com.pe/fileserver/agc',

  // RUTA DEL SERVICIO AGC PARA OBTENER IP DEL HOST
  //headersEndpoint: 'http://localhost:8082/ip',
   headersEndpoint: 'http://apitra.sedapal.com.pe/agc_monitoreo/ip'
  //headersEndpoint: 'http://apisdpdesa01.sedapal.com.pe/agc/ip'
  // headersEndpoint: 'http://sedapal.test:8080/agc/ip'
};