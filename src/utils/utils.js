// Generar un ID aleatorio
export function generateId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
        var t = 16 * Math.random() | 0;
        var n = "x" === e ? t : 3 & t | 8;
        return n.toString(16);
    });
}
export function generateUniqueId(longitud) {
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let cadena = '';
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
        cadena += alfabeto.charAt(indiceAleatorio);
    }
    return cadena;
}
export function getPersonalMode(qlik,config) {
    return new Promise((resolve) => {
        const global = qlik.getGlobal(config);
        global.isPersonalMode((reply) => {
          resolve(reply.qReturn);
        });
    });
}