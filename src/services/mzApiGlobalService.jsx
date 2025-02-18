import GSenseApp from '@config/configGlobal.jsx';
const MzApiGlobalService = {
    requestConfig: {},
    config: {
        host: GSenseApp.APICONFIG.host,
        user: null,
        token: null,
        permissions: null,
        application_id: GSenseApp.APICONFIG.application_id
    },
    opcionesDefault: [
        { id: 1, descripcion: "alertas", opcion_id: 1 },
        { id: 2, descripcion: "marcadores", opcion_id: 2 },
        { id: 3, descripcion: "filtros", opcion_id: 3 },
        { id: 4, descripcion: "glosario", opcion_id: 4 },
        { id: 5, descripcion: "ayuda", opcion_id: 5 },
        { id: 6, descripcion: "modos", opcion_id: 6 },
    ],
    login: async () => {
        try {
            const response = await fetch(`${MzApiGlobalService.config.host}/MzApi/api/v1/login/qs?application_id=${MzApiGlobalService.config.application_id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            MzApiGlobalService.config.token = data.token
            MzApiGlobalService.config.token_refresh = data.token_refresh;
            MzApiGlobalService.requestConfig = {
                headers: {
                    'Authorization': 'Bearer ' + data.token,
                }
            };

            const userResponse = await fetch(`${MzApiGlobalService.config.host}/MzApi/api/v1/me?token=${data.token}`);
            const userData = await userResponse.json();
            MzApiGlobalService.config.user = userData.user;
        } catch (error) {
            console.error("apiService:", error);
            throw error;
        }
    },
    getToken: async () => {
        if (MzApiGlobalService.config.token !== null) {
            return MzApiGlobalService.config.token;
        } else {
            await MzApiGlobalService.login();
            return MzApiGlobalService.config.token;
        }
    },
    /* FAVORITOS*/
    getFavs: async () => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/favoritos/getFavoritosByUser`, {
                headers: MzApiGlobalService.requestConfig.headers
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getFav: async (id, location) => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/favoritos/getFavorito?object_id=${id}&location=${location}`, {
                headers: MzApiGlobalService.requestConfig.headers
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    newFav: async (data) => {
        return MzApiGlobalService.getToken()
            .then(() => {
                return fetch(`${MzApiGlobalService.config.host}/Global/api/favoritos/createFavorito`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...MzApiGlobalService.requestConfig.headers
                    },
                    body: JSON.stringify(data),
                });
            })
            .then((res) => {
                return res;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    deleteFav: async (id, location) => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/favoritos/deleteFavorito?object_id=${id}&location=${location}`, {
                method: 'DELETE',
                headers: MzApiGlobalService.requestConfig.headers
            });
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    /* OPCIONES */
    inicioOpciones: async (opcionesLength) => {
        try {            
            // Obtiene el token de la API
            await MzApiGlobalService.getToken();
            // Crea las opciones 
            if(opcionesLength === 0){
                await fetch(`${MzApiGlobalService.config.host}/Global/api/seed`, {
                    headers: MzApiGlobalService.requestConfig.headers
                });
            }    
            // Crea las opciones mashup de manera concurrente
            await Promise.all(
                MzApiGlobalService.opcionesDefault.map(async (opcion) => {
                    try {
                        const res = await MzApiGlobalService.crearOpcionMashup(opcion.opcion_id);
                        console.log("Opción creada:", res);
                    } catch (error) {
                        console.error(`Error creando opción mashup (ID: ${opcion.opcion_id}):`, error);
                    }
                })
            );
    
            // Retorna el resultado aunque no lo usamos
            return true;
        } catch (error) {
            console.error("Error en inicioOpciones:", error);
            throw error;
        }
    },
    recuperarOpciones: async () => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/opciones/getAllOptions`, {
                headers: MzApiGlobalService.requestConfig.headers
            });
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    recuperarOpcionesMashup: async () => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/opciones/getAllUsuarioMashupOpcion`, {
                headers: MzApiGlobalService.requestConfig.headers
            });
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    crearOpcionMashup: async (data) => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/opciones/createUsuarioMashupOpcion?opcion_id=${data}`, {
                method: 'POST',
                headers: {
                    ...MzApiGlobalService.requestConfig.headers
                }
            });
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    actualizarOpcionMashup: async (id_options, val) => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/opciones/updateUsuarioMashupOpcion?opcion_id=${id_options}&visible=${val}`, {
                method: 'PUT',
                headers: {
                    ...MzApiGlobalService.requestConfig.headers
                }
            });
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    eliminarOpcionMashup: async (id_options) => {
        try {
            await MzApiGlobalService.getToken();
            const res = await fetch(`${MzApiGlobalService.config.host}/Global/api/opciones/deleteUsuarioMashupOpcion?opcion_id=${id_options}`, {
                method: 'DELETE',
                headers: MzApiGlobalService.requestConfig.headers
            });
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export default MzApiGlobalService;
