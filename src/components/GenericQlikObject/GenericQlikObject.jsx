import React, { useState, useEffect, useRef, useContext, Suspense } from 'react';
import GSenseApp from '@config/configGlobal.jsx';
import { arrAppsControl } from "@routes/_routes.jsx";
import QlikContext from "@context/QlikContext"; // Importa el contexto

import ReactDOM from "react-dom";
import { generateId } from '@utils/utils';
import { useTranslation } from "react-i18next";
import ContextMenu from '@components/ContextMenu/ContextMenu';

const GenericQlikObject = (props) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [objectFound, setObjectFound] = useState(true);
    const [visual, setVisual] = useState(null);
    const [elementClasses, setElementClasses] = useState([]);
    const [ROUTER, setROUTER] = useState(props.router);
    const [valorCelda, setValorCelda] = useState('');
    const [typeobject] = useState(props?.typeobject || '');
    const [showSpelDial, setShowSpelDial] = useState(false);
    const objectHideSpeelDial = ['qlik-variable-input', 'text-image', 'filterpane', 'MzGenaro'];
    const elementRef = useRef(null);
    const [_oInteraction] = useState(props.noInteraction || false);
    const [_oSelectable] = useState(props.noSelectable || false);

    const [idUnico] = useState(() => {
        const initId = generateId();
        return initId;
    })

    const [aplication, setAplication] = useState(props.aplication);
    const [qlikObjectID, setqlikObjectID] = useState(props.qlikObjectID);
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const [propertiesContextMenu, setPropertiesContextMenu] = useState({
        top: null,
        left: null,
        fullsize: false,
        dataViewTable: false
    });

    const containerRef = useRef(null);
    const visualRef = useRef(null);

    const { qlik } = useContext(QlikContext);


    useEffect(() => {
        loadObject(aplication, qlik);
        return () => {
            if (visualRef.current && typeof visualRef.current.close === 'function') {
                visualRef.current.close()
                    .then(() => {
                        // console.log('Visual closed');
                    })
                    .catch((error) => {
                        console.error('Error closing visual:', error);
                    });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.aplication, props.qlikObjectID]);


    const handleShowContextMenu = (event, id) => {
        let menuPositionLeft, menuPositionTop;
        let popupHeight = 200;
        let popupWidth = 250;

        const { type, currentTarget, pageX, pageY } = event;
        const { top, left } = currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        let objectHasSoftPatches = visual.model?.enigmaModel?.layout?.qHasSoftPatches || false;
        let objectHasSoftPatchesHeight = objectHasSoftPatches ? 40 : 0;
        let typeObject = visual.model?.enigmaModel?.layout?.visualization || visual.model.layout.qInfo.qType;
        if (typeObject === 'container') {
            typeObject = visual.model.items.currentModel.enigmaModel.layout.visualization;
            objectHasSoftPatchesHeight = 0;
            console.log(visual.model);
        }

        if (event.target) {
            let contenedor = event.target.closest('.qv-object-content-container');
            if (contenedor) {
                var n = (event.target).innerText;
                setValorCelda(n || '');
            } else {
                setValorCelda('');
            }
        }

        switch (typeObject) {
            case 'kpi':
                popupHeight = 192;
                popupWidth = 250;
                break;
            case 'map':
                popupHeight = 230;
                popupWidth = 250;
                break;
            case 'gauge':
            case 'piechart':
            case 'barchart':
            case 'linechart':
                popupHeight = 268 + objectHasSoftPatchesHeight;
                popupWidth = 250;
                break;
            case 'table':
                popupHeight = 228;
                popupWidth = 250;
                break;
            case 'pivot-table':
                popupHeight = 304;
                popupWidth = 250;
                break;
            default:
                popupHeight = 268 + objectHasSoftPatchesHeight;
                popupWidth = 250;
        }

        if (type === "click") {
            if (left + popupWidth + 38 >= windowWidth) {
                menuPositionLeft = left - (popupWidth + 10);
            } else {
                menuPositionLeft = left + 38;
            }
            if (top + popupHeight >= windowHeight) {
                menuPositionTop = top - (popupHeight - 28);
            } else {
                menuPositionTop = top;
            }
        } else {
            if (pageX + popupWidth > windowWidth) {
                menuPositionLeft = windowWidth - popupWidth - 40;
            } else {
                menuPositionLeft = pageX;
            }
            if (pageY + popupHeight > windowHeight) {
                menuPositionTop = pageY - popupHeight;
            } else {
                menuPositionTop = pageY;
            }
        }

        clearContextMenu().then(() => {
            const contextMenuProps = {
                top: menuPositionTop,
                left: menuPositionLeft
            };
            setPropertiesContextMenu(contextMenuProps);
            setIsContextMenuVisible(true);

            let contenedor = containerRef.current.closest('.box_object');
            if (contenedor) {
                contenedor.classList.add('first-position');
            }
        });
    };

    const clearContextMenu = () => {
        return new Promise((resolve) => {
            const contextMenuElement = document.getElementById('mz-contextmenu');
            if (contextMenuElement) {
                setIsContextMenuVisible(false);
                let contenedor = containerRef.current.closest('.box_object');
                if (contenedor) {
                    contenedor.classList.remove('first-position');
                }
                ReactDOM.unmountComponentAtNode(contextMenuElement);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    const getObjectApp = async () => {
        // Obtenemos la aplicación para abrir el objeto
        return new Promise(async resolve => {
            if (props.aplication) {
                resolve(props.aplication);
            } else {
                if (typeof arrAppsControl !== "undefined" && typeof arrAppsControl[props.appId].APPSENSE === "object") {
                    setAplication(arrAppsControl[props.appId].APPSENSE);
                    resolve(arrAppsControl[props.appId].APPSENSE);
                } else {
                    let _app = '';
                    _app = await GSenseApp.Qlikproperties.QS.openApp(
                        GSenseApp.arrApps[props.appId].idapp,
                        GSenseApp.Qlikproperties.QSCON
                    );
                    GSenseApp.arrApps[props.appId].APPSENSE = _app;
                    setAplication(_app);
                    resolve(_app);
                }
            }
        });
    };

    // Eliminamos la función customGaugeAngle o la mantenemos
    // sin llamar para que Qlik muestre el Gauge nativo
    const customGaugeAngle = (vis) => {
        // Dejar vacío o eliminar por completo:
        // Aquí no hacemos nada para evitar personalizar el gauge.
        return new Promise(resolve => {
            resolve(); 
        });
    };

    const loadObject = async (ap, qs) => {
        let thisIsloaded = false;
        let contenedor = containerRef.current;
        let thisApp = await getObjectApp();

        if (contenedor) {
            thisApp.visualization.get(props.qlikObjectID).then(async (vis) => {
                setLoaded(true);
                const typeObject = vis.model?.enigmaModel?.layout?.visualization || vis.model.layout.qInfo.qType;
                const ObjectTypesExcludes = ['MzKPI', 'kpi', 'sn-layout-container', 'qlik-variable-input', 'text-image'];
                setShowSpelDial(!objectHideSpeelDial.includes(typeObject));
                setElementClasses(prevEstado => [
                    ...prevEstado,
                    "qv-object-".concat(typeObject)
                ]);

                if (
                    vis.model.layout.showTitles === false ||
                    vis.model.layout.title === undefined ||
                    vis.model.layout.title === ''
                ) {
                    if (!ObjectTypesExcludes.some(type => typeObject.includes(type))) {
                        setElementClasses(prevEstado => [
                            ...prevEstado,
                            'object_no_title'
                        ]);
                    }
                }

                // No aplicamos customGaugeAngle:
                // if (typeObject === 'gauge') {
                //   await customGaugeAngle(vis);
                // }

                vis.show(contenedor, {
                    "noInteraction": _oInteraction,
                    "noSelections": _oSelectable,
                    onRendered: () => {
                        if (!thisIsloaded) {
                            thisIsloaded = true;
                            setOpen(true);
                            setVisual(vis);
                            visualRef.current = vis;
                            handleLoad();
                        }
                    }
                });
            }).catch(function (error) {
                handleLoad();
                setObjectFound(false);
                contenedor.innerHTML = `<div class="object-not-found">${t("common.ObjectNotFound")}</div>`;
            });
        } else {
            console.error("No se encontró el contenedor:", props.qlikObjectID);
        }
    };

    const handleCloseContextMenu = () => {
        clearContextMenu();
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        handleShowContextMenu(e, qlikObjectID);
    };

    const handleLoad = () => {
        setLoaded(true);
        props.onObjectLoaded(true);
    };

    return (
        <React.Fragment>
            <Suspense fallback={<div className='momentum transparent'></div>}>
                {loaded && objectFound && showSpelDial && !props.hidespeeldial && (
                    <React.Fragment>
                        <div className="speeldial" onClick={(event) => handleShowContextMenu(event, idUnico)}>
                            <i className="ri-more-line"></i>
                        </div>
                    </React.Fragment>
                )}
                {isContextMenuVisible && ReactDOM.createPortal(
                    <ContextMenu
                        onCloseContextMenu={handleCloseContextMenu}
                        visual={visual}
                        qlikObjectID={qlikObjectID}
                        idUnico={idUnico}
                        aplication={aplication}
                        location={props.location}
                        router={props.router}
                        propertiescontextmenu={propertiesContextMenu}
                        fullsize={props.fullsize}
                        valorCelda={valorCelda}
                        typeobject={typeobject}
                    />,
                    document.body
                )}
                <div
                    className={`native-chart qvobject qlik-embed ${elementClasses.join(' ')}`}
                    id={idUnico}
                    ref={containerRef}
                    qlikObjectID={qlikObjectID}
                    onContextMenu={loaded && objectFound && showSpelDial && !props.hidespeeldial ? handleContextMenu : undefined}
                >
                    <div className="loader-container">
                        <img src="assets/img/core/scan-spinner.gif" alt="loading"/>
                    </div>
                </div>
            </Suspense>
        </React.Fragment>
    );
};

export default GenericQlikObject;
