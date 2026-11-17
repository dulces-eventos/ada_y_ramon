/* ===== DATOS DEL CLIENTE: es el único archivo que se edita por cada invitación ===== */
/* Todo lo que se deje vacío ('' o null) se oculta solo en la invitación. */
const INV={
  novios:['Ramón','Ada'], iniciales:['R','A'],
  nombresCompletos:['Alcides Ramón Benítez Jacquet','Ada Carlina Martínez Morán'],
  /* iso: fecha y hora para la cuenta regresiva, p. ej. '2027-01-02T20:00:00-03:00' */
  fecha:{iso:'2027-01-02T20:00:00-03:00',dia:'sábado',num:'02',mes:'enero',anio:'2027',hora:'20:00 h'},
  ceremonia:{tipo:'Ceremonia Religiosa',lugar:'Capilla San Roque',direccion:'',mapa:'https://maps.app.goo.gl/ZPt4j21rYBp1v4dj9?g_st=aw'},
  fiesta:{lugar:'Nuestro Domicilio',recepcion:'Nuestro Domicilio Particular',hora:'Luego de la ceremonia religiosa'}, /* lugar = texto del video; recepcion = sección Recepción; hora puede ser una hora fija, p. ej. '21:00 Hrs' */
  versiculo:{texto:'El amor nunca se da por vencido, jamás pierde la fe, siempre tiene esperanzas y se mantiene firme en toda circunstancia.',cita:'1 Corintios 13:7'},
  padres:{novia:['Isidro Martínez Torres +','Teodora Morán Vda. de Martínez'],novio:['Bernardino Benítez Jara','Georgina Jacquet Benítez +']},
  padrinos:['José Antonio Ovelar Núñez','Alma Denise Martínez de Ovelar'],
  dress:{codigo:'Semi formal',
    damas:[['vestido','Vestido largo o midi'],['tacon','Calzado cómodo y elegante (ideal para césped)']],
    caballeros:[['camisa','Camisa manga media o larga'],['pantalon','Pantalón de vestir o de tela tipo gabardina'],['zapato','Calzado formal o casual elegante']],
    colores:[['Blanco','#ffffff'],['Negro','#111111'],['Rojo','#d1342f']]},
  limite:'', /* fecha límite de confirmación; vacío = no se muestra */
  whatsapp:'0984410275', codigoPais:'595', /* número para confirmar asistencia (puede llevar el 0 inicial); codigoPais = Paraguay */
  fotos:[], /* rutas de fotos, p. ej. ['imagenes/foto1.jpg', ...]; vacío = fuegos artificiales animados */
  musica:'audio.mp3'
};
