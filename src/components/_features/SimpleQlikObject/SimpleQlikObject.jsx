import React, { useState, useEffect, useRef, useContext, Suspense } from 'react';
import GSenseApp from '@config/configGlobal.jsx';
import { arrAppsControl } from "@routes/_routes.jsx";
import { generateId } from '@utils/utils';
import { useTranslation } from 'react-i18next';

const SimpleQlikObject = (props) => {  
    const { t } = useTranslation();
    const [idUnico] = useState(() => {
        const initId = generateId();
        return initId;
    })
    const qlikObjectID = useState(props.qlikObjectID);
    const containerRef = useRef(null);
    const visualRef = useRef(null); // Referencia para mantener la visual

    useEffect(() => {
        loadObject();
        return () => {
            if (visualRef.current && typeof visualRef.current.close === 'function') {
                visualRef.current.close().then(() => {
                    //console.log('Visual closed');
                }).catch((error) => {
                    console.error('Error closing visual:', error);
                });
            }
        };
    }, []);

    const getObjectApp = async () => {
        // Obtenemos la aplicación para abrir el objeto
        return new Promise(async resolve => {
            if (props.aplication) {
                resolve(props.aplication);
            } else {
                if (typeof arrAppsControl != "undefined" && typeof arrAppsControl[props.appId].APPSENSE == "object") {
                    resolve(arrAppsControl[props.appId].APPSENSE)
                } else {
                    let _app = '';
                    _app = await GSenseApp.Qlikproperties.QS.openApp(GSenseApp.arrApps[props.appId].idapp, GSenseApp.Qlikproperties.QSCON);

                    let thisApplication = arrAppsControl.find((name) => name.idapp == GSenseApp.arrApps[props.appId].idapp);
                    let newApplication = { ...thisApplication, APPSENSE: _app };
                    let index = arrAppsControl.findIndex((name) => name.idapp == GSenseApp.arrApps[props.appId].idapp);
                    arrAppsControl[index] = newApplication;
                    GSenseApp.arrApps[index] = newApplication;
                    resolve(_app)
                }
            }
        })
    }

    const loadObject = async () => {
        let thisIsloaded = false;
        let contenedor = containerRef.current;
        let thisApp = await getObjectApp();

        if (contenedor) {
            thisApp.visualization.get(props.qlikObjectID).then(async (vis) => {
                vis.show(contenedor, {
                    onRendered: () => {
                        if (!thisIsloaded) {
                            thisIsloaded = true;
                            visualRef.current = vis; // Asigna la visual a la referencia
                        }
                    }
                });
            }).catch(function (error) {
                // Si no se puede obtener el objeto, muestra un mensaje de error al usuario
                contenedor.innerHTML = `<div class="object-not-found">${t("common.ObjectNotFound")}</div>`;
                //console.error("Error al cargar el objeto:", error);
            });

        } else {
            console.error("No se encontró el contenedor:", props.qlikObjectID);
        }
    }

    return (
        <React.Fragment>
                <div
                    className="native-chart qvobject qlik-embed"
                    id={idUnico}
                    ref={containerRef}
                    qlikObjectID={qlikObjectID}>
                    <div className="loader-container">
                        <img src="assets/img/core/scan-spinner.gif" />
                    </div>

                </div>
        </React.Fragment>
    );
}
export default SimpleQlikObject;
