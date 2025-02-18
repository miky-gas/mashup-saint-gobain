import MzApiGlobalService from '@services/mzApiGlobalService';

const mzOptionsService = {
  opcionesDefault: [
    { id: 1, descripcion: "alertas", opcion_id: 1 },
    { id: 2, descripcion: "marcadores", opcion_id: 2 },
    { id: 3, descripcion: "filtros", opcion_id: 3 },
    { id: 4, descripcion: "glosario", opcion_id: 4 },
    { id: 5, descripcion: "ayuda", opcion_id: 5 },
    { id: 6, descripcion: "modos", opcion_id: 6 },
  ],

  fetchAllMzOptions: async () => {
    try {
      const opcionesResponse = await MzApiGlobalService.recuperarOpciones();
      const opciones = opcionesResponse || [];

      if (opciones.length > 0) {
        const opcionesMashupResponse = await MzApiGlobalService.recuperarOpcionesMashup();
        const opcionesMashup = opcionesMashupResponse || [];

        if (opcionesMashup.length > 0) {
          // await loadOptions(opcionesMashup);
          console.log("Opciones mashup cargadas:", opcionesMashup);
        } else {
          await Promise.all(
            mzOptionsService.opcionesDefault.map(async (opcion) => {
              try {
                const res = await MzApiGlobalService.crearOpcionMashup(opcion.opcion_id);
                console.log("Opción creada:", res.data);
              } catch (error) {
                console.error("Error creando opción mashup:", error);
              }
            })
          );
        }
      } else {
        console.warn("No se encontraron opciones.");
      }
    } catch (error) {
      console.error("Error al recuperar opciones:", error);
      // INICIALIZAR VARIABLES POR DEFECTO A TRUE
      return false;
    }
  },
};

export default mzOptionsService;
