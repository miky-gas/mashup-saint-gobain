var NAMEAPP = process.env.NAMEAPP; 
var CLIENTE = process.env.CLIENTE; 
var TIPO = process.env.TIPO; 
module.exports = {
    "type": "mashup",
    "name": NAMEAPP,
    "description": "Mashup template",
    "version": "1.0.0",
    "author": "Jesús Yepes López",
    "homepage": "",
    "keywords": "qlik-sense, visualization, mashup",
    "license": "",
    "repository": "",
    "dependencies": {
      "qlik-sense": ">=3.0.x"
    },
    "preview": "image-dev-hub.jpg",
    "Tipo": TIPO,
    "Cliente": CLIENTE
};