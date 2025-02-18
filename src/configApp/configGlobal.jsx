import { arrAppsControl } from "@routes/_routes.jsx";
const GSenseApp = {
    qlikVisuals: [],
    qlikVisualsCurrentSelections: '',
    listSessionParent: [],
    statesCompare: [],
    BOOKMARKLIST: [],
    DEFAULTBOOKMARID: '',
    Qlikproperties: {
        QS: '',
        QSCON: '',
        CURRENTAPP: '',
        LASTRELOADTIME: ''
    },
    /*
     *Los ID de las aplicaciones se añaden en los diferentes ficheros de configuración `_configenv` (según servidor, desarrollo, producción , etc)  
     *No añadir aquí el array de aplicaciones, lo hacemos desde GULP
     */

    /*-- No eliminar el comentario siguiente, lo usamos desde GULP para añadir el array de aplicaciones */
    // eslint-disable-next-line no-unused-labels
arrApps: [
    {
        name: 'Ventas',
        idapp: 'Formación EHS',          
        init: false,
        load: false,
        bookmarkApp:{
            hasBookmarkDefaultUser: false,
            bookmarkDefaultUserId: '',
            bookmarkDefaultUser: ''
        }
    }
],
APICONFIG : {
    host: 'https://dev-sense.mercanza.net:4000',
    application_id : 2
},
    init: {
        demo: false,
        listLanguages: ['es', 'en'],
        language: 'es',
        multilanguage: false,
        typeLanguage: 'variable',
        varLanguage: 'vIdiomaSeleccionado',
        fieldLanguage: 'Idioma',
        darkView: false,
        modeView: false,        
        noGlossary: ['noGlossary', 'noreporting'], //Tag en Medidas y Dimensiones para no mostrar en el Glosario                                                
        Themes: "-Pallete-Theme-Saint-Gobain",
        isLoadTheme: false, // Comprobar si ya hemos cargado el tema: este flag no se cambia aquí, lo hace la aplicación cuando aplica el tema
        viewLogout: false, // ver botón cerrar sesión
    },
    getDataApp: function (appID) {
        return new Promise(async resolve => {
            // console.log(this.Qlikproperties, 'Qlikproperties')
            // console.log(window.QLIKPROPERTIES, 'window.QLIKPROPERTIES')
            //Cerramos las Sesiones Parent
            GSenseApp.removeSesionParent();
            let _app;
            document.body.setAttribute('data-app', appID);
            let thisApplication = arrAppsControl.find((name) => name.idapp == appID);
            if (thisApplication.APPSENSE) {
                _app = thisApplication.APPSENSE;
            } else {
                _app = await this.Qlikproperties.QS.openApp(appID, this.Qlikproperties.QSCON);
                thisApplication.APPSENSE = _app;
            }
            this.Qlikproperties.CURRENTAPP = _app;
            // _app.model.enigmaModel.global.removeAllListeners();
            //Obtenemos la fecha de última recarga de la aplicación
            GSenseApp.Qlikproperties.LASTRELOADTIME = await GSenseApp.getLastReloadTime(_app);
            //GSenseApp.setLanguageToApp(_app, GSenseApp.init.language)
            resolve(_app);
        });
    },
    setLanguageToApp: function (app, language) {
        app.variable.setStringValue(GSenseApp.init.varLanguage, language).then(function () {
            // console.log("Idioma cambiado a través de la variable.");
        }).catch(function () {
            // Si falla, intenta cambiar el idioma usando el campo
            app.field(GSenseApp.init.fieldLanguage).getData().then(function (FieldLanguage) {
                // Función para actualizar el campo de idioma
                var cambioIdioma = function () {
                    switch (FieldLanguage.rows.length) {
                        case 0:
                            // Si no hay datos en el campo, salir de la función
                            console.log("No hay datos en el campo para cambiar el idioma.");
                            return false;
                        default:
                            // Limpiar la selección actual en el campo
                            app.field(GSenseApp.init.fieldLanguage).clear();
                            // Seleccionar el nuevo valor de idioma en el campo
                            app.field(GSenseApp.init.fieldLanguage).selectValues([language.toUpperCase()], false, true);
                            console.log("Idioma cambiado a través del campo.");
                            break;
                    }
                    // Desvincular el evento una vez que se ha completado el cambio
                    FieldLanguage.OnData.unbind(cambioIdioma);
                };

                // Vincular la función de cambio de idioma al evento OnData
                FieldLanguage.OnData.bind(cambioIdioma);
            }).catch(function (error) {
                console.error("Error al obtener datos del campo:", error);
            });
        }).catch(function (error) {
            console.error("Error al establecer el valor de la variable:", error);
        });
    },
    getBookmar(app) {
        return new Promise(async function (resolve, reject) {
            var APP = app;
            var listBookmark = [];
    
            APP.getList("BookmarkList", function (reply) {
                reply.qBookmarkList.qItems.forEach(function (value) {
                    listBookmark.push(value);
                });
                APP.destroySessionObject(reply.qInfo.qId)
                resolve(listBookmark);
            });
        });
    },
    getBookmarkId: function (aplication, index) {
        const self = this;
        return new Promise(async function (resolve, reject) {
            let Appsense = aplication;
            let thisApplication = arrAppsControl.find((name) => name.idapp == Appsense.id);
            Appsense.model.waitForOpen.promise.then(async () => {
                if (thisApplication.init == false) {
                    thisApplication.init = true;
                    let _listBookmark = await self.getBookmar(Appsense);
                    thisApplication.bookmarkApp.bookmarkDefaultUser = _listBookmark.find((state) => state.qMeta?.isUserPred == true);
                    if(thisApplication.bookmarkApp.bookmarkDefaultUser){
                        thisApplication.bookmarkApp.bookmarkDefaultUserId = thisApplication.bookmarkApp.bookmarkDefaultUser.qInfo.qId;
                        thisApplication.bookmarkApp.hasBookmarkDefaultUser = true;
                        Appsense.bookmark.apply(thisApplication.bookmarkApp.bookmarkDefaultUserId); 
                        // resolve(true);
                        // return;
                    }



                    let _defaultBookmarkId = '';
                    Appsense.model.engineApp.createSessionObject({
                        qInfo: {
                            qId: "AppPropsList",
                            qType: "AppPropsList"
                        },
                        qAppObjectListDef: {
                            qType: "appprops",
                            qData: {
                                defaultBookmarkId: "/defaultBookmarkId",
                                sheetTitleBgColor: "/sheetTitleBgColor",
                                sheetTitleGradientColor: "/sheetTitleGradientColor",
                                sheetTitleColor: "/sheetTitleColor",
                                sheetLogoThumbnail: "/sheetLogoThumbnail",
                                sheetLogoPosition: "/sheetLogoPosition",
                                rtl: "/rtl",
                                theme: "/theme"
                            }
                        }
                    }).then(function (qBook) {
                        qBook.getLayout().then(function (properties) {
                            Appsense.model.engineApp.createSessionObject({
                                "qInfo": {
                                    "qId": "BL01",
                                    "qType": "BookmarkList"
                                },
                                "qBookmarkListDef": {
                                    "qType": "bookmark"
                                }
                            }).then(function (qBookBookmark) {
                                qBookBookmark.getLayout().then(function (res) {
                                    var arrBookmar = res.qBookmarkList.qItems;
                                    var $dim = arrBookmar.filter(obj => {
                                        if (Object.prototype.hasOwnProperty.call(obj.qMeta, 'defaultBookmarkId')) {
                                            return obj;
                                        }
                                    });
                                    if ($dim.length > 0) {
                                        _defaultBookmarkId = $dim[0].qMeta.defaultBookmarkId;
                                    } else {
                                        _defaultBookmarkId = properties.qAppObjectList.qItems[0].qData.defaultBookmarkId;
                                    }

                                    if (typeof _defaultBookmarkId !== "undefined" && _defaultBookmarkId !== null) {
                                        self.DEFAULTBOOKMARID = _defaultBookmarkId;
                                        if(!thisApplication.bookmarkApp.bookmarkDefaultUser){
                                            setTimeout(function () {
                                                resolve(
                                                    Appsense.model.engineApp.applyBookmark(
                                                        {
                                                            "qId": _defaultBookmarkId
                                                        }
                                                    )
                                                );
                                            }, 600)
                                        }else {
                                            resolve();
                                        }
                                        
                                    } else {
                                        resolve();
                                    }
                                }).catch(() => {
                                    resolve();
                                });
                            });
                        }).catch(() => {
                            throw new Error("No se pudieron recuperar las propiedades de la aplicación");
                        });
                    });
                } else {
                    // console.log('No aplica')
                    resolve(true)
                }
            }).catch((function (e) {
                throw new Error(e)
            }))
        })
    },
    // Método para añadir un visual de objeto Qlik Sense
    addVisualObject: function (visualObject) {
        //console.log(visualObject)
        this.qlikVisuals.push(visualObject);
    },

    // Método para eliminar un visual de objeto Qlik Sense
    removeVisualObject: function () {
        //console.log(this.qlikVisuals);
        // Verificar si hay elementos en el array antes de ejecutar el bucle
        if (this.qlikVisuals.length > 0) {
            this.qlikVisuals.forEach(visual => {
                visual.close().then(() => {
                    // console.log('Visual closed');
                }).catch(error => {
                    console.error('Error closing visual filters:', error);
                });
            });
            // Eliminar todos los elementos del array
            this.qlikVisuals = [];
        }
    },
    addSesionParent: function (session) {
        this.listSessionParent.push(session);
    },
    removeSesionParent: function () {
        if (this.listSessionParent && this.listSessionParent.length >= 1) {
            this.listSessionParent.forEach((value, key) => {
                try {
                    const thisApp = value.app;
                    const id = value.idSession;
                    thisApp.destroySessionObject(id).then((res) => {
                        // console.log(res + ' :::: ' + value.idSession );
                    });
                } catch (error) {
                    console.log(`Error eliminando el objeto:\nValue: ${JSON.stringify(value, null, 2)}\nKey: ${key}\nError: ${error}`);
                }
            });
            this.listSessionParent = [];
        }

    },
    loadTheme: () => {
        return new Promise(async resolve => {
            if (GSenseApp.init.isLoadTheme === false) {
                GSenseApp.init.isLoadTheme = true;
                GSenseApp.Qlikproperties.QS.theme.apply(GSenseApp.init.Themes).then(function () {
                    resolve()
                });
            } else {
                resolve();
            }
        })

    },
    getLastReloadTime: (aplication) => {
        return new Promise(async function (resolve, reject) {
            try {
                aplication.getAppLayout(function (layout) {
                    let LastReloadTime = layout.qLastReloadTime;
                    resolve(LastReloadTime)
                });
            } catch (error) {
                console.log(error);
                resolve(false);
            }

        })
    },
    getUser: () => {
        return new Promise(async function (resolve, reject) {
            resolve(GSenseApp.Qlikproperties)
        })
    },
    enterPage: function (appID) {
        
    },
};
export default GSenseApp;
