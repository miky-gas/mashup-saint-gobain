import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Notify from 'devextreme/ui/notify';

import { useDispatch, useSelector } from 'react-redux';
import store, { setRoot, clearRoot, removePatches } from '@store/store'; // Importa tu store Redux
import MzApiGlobalService from '@services/mzApiGlobalService';

import { QlikProvider } from "@context/QlikContext.jsx";
import { useTranslation } from "react-i18next";
import { arrAppsControl } from "@routes/_routes.jsx";
import GSenseApp from '@config/configGlobal.jsx';

const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject.jsx'));
const ModalComponent = React.lazy(() => import('@components/_features/ModalComponent/ModalComponent.jsx'));

const ContextMenu = (props) => {
    const { t } = useTranslation();
    const [typeobject] = useState(props?.typeobject || '');
    const dispatch = useDispatch();
    const root = useSelector(state => state.root.root);
    const [state, setState] = useState({
        idUnico: props.idUnico,
        objectTypesNotTableView: ['map', 'table', 'kpi', 'MzKPI', 'MzGenaro', 'qlik-trellis-container'],
        objectTypesNotExportData: ['map', 'MzGenaro', 'qlik-trellis-container'],
        objectTypesNotDownloads: ['MzGenaro', 'qlik-trellis-container'],
        objectTypesNotSoftPatches: ['map', 'container', 'gauge', 'pivot-table'],
        objectTypesValorCelda: ['table', 'pivot-table'],        
        fullsize: props.fullsize,
        dataviewtable: props.visual._isToggled,
        showItemDownload: false,
        showItemExpand: false,
        isMzGenaro: false,
        isContainer: props.visual.model.layout.visualization == 'container' ? true : false,
        haveExportarDatos: false,
        isSoftPatches: props.visual.model?.enigmaModel?.layout?.qHasSoftPatches,
        isPivotTable: false,
        currentModel: props.visual.model

    });
    const containerRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        hasPivoteTableFlag();
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);




    const hasPivoteTableFlag = () => {
        switch (props.visual.model.layout.visualization) {
            case 'pivot-table':
                setState(prevState => ({ ...prevState, isPivotTable: true }));
                break;
            case 'container':
                props.visual.model.getProperties().then(function () {                    
                    let activeObjectFromContainer = props.visual.model.items.activeId;
                    props.aplication.getObjectProperties(activeObjectFromContainer).then(function (model) {
                        let typeObject = model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;
                        switch (typeObject) {
                            case 'pivot-table':
                                setState(prevState => ({ ...prevState, isPivotTable: true, currentModel:props.visual.model.items.currentModel }));
                                break;
                            default:
                                setState(prevState => ({ ...prevState, isPivotTable: false, currentModel:props.visual.model.items.currentModel }));
                                break;
                        }
                    })
                })
                break;
            default:
                break;
        }
    }


    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            closeContextMenu();
        }
    };
    const ObjectLoaded = () => {
        setState(prevState => ({ ...prevState, fullsize: true }));
    };
    const handleGetFullSize = (id) => {
        closeContextMenu();
        let div = document.createElement('div');
        div.classList.add('full-size-object');
        div.id = 'full-size-object';
        document.body.prepend(div);
        const newRoot  = createRoot(document.getElementById("full-size-object"));
        dispatch(setRoot(newRoot));
        newRoot.render(<Suspense fallback={<div className='momentum transparent'></div>}><Provider store={store}><QlikProvider><GenericQlikObject aplication={props.aplication} qlikObjectID={id} visual="" fullsize={true} onObjectLoaded={ObjectLoaded} location={props.location} router={props.router} /></QlikProvider></Provider></Suspense>)
    };


    const handleLostFullSize = () => {
        closeContextMenu();
        document.getElementById('full-size-object').remove();
        setState({ ...state, fullsize: false });
        dispatch(clearRoot());
    };

    const handleToggleDataViewTable = () => {
        closeContextMenu();
        var visual = props.visual;
        let isContainer = visual.model.genericType == 'container' ? true : false;
        if (isContainer) {
            visual.model.items.currentObject.toggleDataView().then((toggled) => {
                setState({ ...state, dataviewtable: toggled });
            });
        } else {
            visual.toggleDataView().then((toggled) => {
                setState({ ...state, dataviewtable: toggled });
            });
        }
    };

    const handleCopyToClipboard = () => {
        if (!document.hasFocus()) {
            // Forzar el enfoque del documento
            const focusElement = document.body;
            focusElement.focus();
        }
        navigator.clipboard.writeText(props.valorCelda)
    }

    const closeContextMenu = () => {
        if (props.onCloseContextMenu) {
            props.onCloseContextMenu();
        }
    };

    const handleShowItemsDownload = () => {
        setState({ ...state, showItemDownload: true });
    };

    const handleHideItemsDownload = () => {
        setState({ ...state, showItemDownload: false });
    };

    const handleShowModal = (type, title, width, height) => {
        closeContextMenu();
        let div = document.createElement('div');
        div.classList.add('mz-modal');
        div.id = 'mz-modal';
        document.body.prepend(div);
        const newRoot = createRoot(document.getElementById("mz-modal"));
        newRoot.render(<Suspense fallback={<div className='momentum transparent'></div>}><QlikProvider><ModalComponent onCloseModal={() => handleCloseModal()} aplication={props.aplication} qlikObjectID={props.qlikObjectID} visual={props.visual} type={type} title={title} width={width} height={height}></ModalComponent></QlikProvider></Suspense>)        
    };




    const handleCloseModal = () => {
            const modal = document.getElementById('mz-modal');
            if (modal) {                
                modal.remove();
                return true;
            } else {
                return false;
            }                        
    };

    const handleClearSoftPatches = () =>{
        props.visual.model.clearSoftPatches();
        dispatch(removePatches({ objectId: props.qlikObjectID }));
    }

    //Expandir Pivot Table
    const handleShowItemsExpand = () => {
        setState({ ...state, showItemExpand: true });
    }
    const handleHidetemsExpand = () => {
        setState({ ...state, showItemExpand: false });
    }
    const handleExpand = () => {
        let _patches = [{
            "qPath": "/qHyperCubeDef/qAlwaysFullyExpanded",
            "qOp": "replace",
            "qValue": "false"
        }];


        state.currentModel.applyPatches(_patches, true).then(function () {
            state.currentModel.expandTop({
                "qPath": "/qHyperCubeDef",
                "qRow": 0,
                "qCol": 0,
                "qAll": true
            }).then(function () {
                state.currentModel.expandLeft({
                    "qPath": "/qHyperCubeDef",
                    "qRow": 0,
                    "qCol": 0,
                    "qAll": true
                })
                closeContextMenu();
            })
        });

    }
    const handleContract = () => {
        let _patches = [{
            "qPath": "/qHyperCubeDef/qAlwaysFullyExpanded",
            "qOp": "replace",
            "qValue": "false"
        }];



        state.currentModel.applyPatches(_patches, true).then(function () {
            state.currentModel.collapseTop({
                "qPath": "/qHyperCubeDef",
                "qRow": 0,
                "qCol": 0,
                "qAll": true
            }).then(function () {
                state.currentModel.collapseLeft({
                    "qPath": "/qHyperCubeDef",
                    "qRow": 0,
                    "qCol": 0,
                    "qAll": true
                })
                closeContextMenu();
            })
        });

    }
    //  VER DATOS  
    const DataViewToggleButton = () => {
        const isValidType = !state.objectTypesNotTableView.includes(props.visual.model.layout.visualization);

        if (!isValidType) {
            return null;
        }

        if (props.visual.model.layout.visualization === 'container') {
            return (
                <li className="lui-list__item lui-list__action" onClick={() => handleToggleDataViewTable()}>
                    <i className="lui-list__aside item-icon lui-icon lui-icon--object"></i>
                    <span className="lui-list__text" title="Ver gráfico/Datos">Ver gráfico/Datos</span>
                </li>
            );
        } else {
            return (
                <li className="lui-list__item lui-list__action" onClick={() => handleToggleDataViewTable()}>
                    {state.dataviewtable ? (
                        <>
                            <i className="lui-list__aside item-icon lui-icon lui-icon--object"></i>
                            <span className="lui-list__text" title={t("contextMenu.label.verGrafico")}>{t("contextMenu.label.verGrafico")}</span>
                        </>
                    ) : (
                        <>
                            <i className="lui-list__aside item-icon lui-icon lui-icon--table"></i>
                            <span className="lui-list__text" title={t("contextMenu.label.verDatos")}>{t("contextMenu.label.verDatos")}</span>
                        </>
                    )}
                </li>
            );
        }
    };

    //Full Size
    const FullSizeToggleButton = () => {
        return (
            <li className="lui-list__item lui-list__action linkSize" onClick={props.fullsize ? () => handleLostFullSize(props.qlikObjectID) : () => handleGetFullSize(props.qlikObjectID)}>
                <i className={"lui-list__aside item-icon lui-icon " + (props.fullsize ? "lui-icon--collapse" : "lui-icon--expand")}></i>
                <span className="lui-list__text" title={props.fullsize ? t("contextMenu.label.SalirPantallaCompleta") : t("contextMenu.label.PantallaCompleta")}>{props.fullsize ? t("contextMenu.label.SalirPantallaCompleta") : t("contextMenu.label.PantallaCompleta")}</span>
            </li>
        );
    };

    //Botón descargas
    const DownloadButton = () => {
        const isValidType = !state.objectTypesNotDownloads.includes(props.visual.model.layout.visualization);
        if (!isValidType) {
            return null;
        }
        return (
            <React.Fragment>
                <li className="lui-list__item lui-list__action qv-contextmenu-has-submenu has-icon" onClick={() => handleShowItemsDownload()}>
                    <i className="lui-list__aside  item-icon  lui-icon  lui-icon--download"></i>
                    <span className="lui-list__text" title="Descargar como">{t("contextMenu.label.descargarComo")}</span>
                    <i className="next-icon lui-list__aside lui-icon lui-icon--triangle-right" aria-hidden="false"></i>
                </li>
            </React.Fragment>
        );
    };

    //Lista descargas
    const DownloadItemsList = () => {
        const isValidType = !state.objectTypesNotExportData.includes(props.visual.model.layout.visualization);
        return (
            <React.Fragment>
                <li className="lui-list__item lui-list__action" onClick={() => handleHideItemsDownload()}>
                    <i className="lui-list__aside back-icon lui-icon  lui-icon--triangle-left"></i>
                    <span className="lui-list__text" title={t("contextMenu.label.volver")}>{t("contextMenu.label.volver")}</span>
                </li>

                {!state.dataviewtable ? (
                    <React.Fragment>
                        <li className="lui-list__item lui-list__action" onClick={() => handleShowModal('exportimage', t("Print.Image.Title"), 500, 290)}>
                            <i className="lui-list__aside  item-icon  lui-icon  lui-icon--image"></i>
                            <span className="lui-list__text" title={t("contextMenu.label.exportImagen")}>{t("contextMenu.label.exportImagen")}</span>
                        </li>
                        <li className="lui-list__item lui-list__action" onClick={() => handleShowModal('exportpdf', t("Print.Pdf.Title"), 500, 290)}>
                            <i className="lui-list__aside  item-icon  lui-icon  lui-icon--export"></i>
                            <span className="lui-list__text" title={t("contextMenu.label.exportPdf")}>{t("contextMenu.label.exportPdf")}</span>
                        </li>
                    </React.Fragment>
                ) : null}

                {isValidType ? (
                    <React.Fragment>
                        <li className="lui-list__item lui-list__action" onClick={() => handleShowModal('exportdatos', t("Export.Completed"), 600, 200)}>
                            <i className="lui-list__aside  item-icon  lui-icon  lui-icon--insert"></i>
                            <span className="lui-list__text ng-binding" title={t("contextMenu.label.exportDatos")}>{t("contextMenu.label.exportDatos")}</span>
                        </li>
                    </React.Fragment>
                ) : null}
            </React.Fragment>
        );
    };


    //Botón copiar celda
    const ValorCeldaButton = () => {
        if (state.objectTypesValorCelda.includes(props.visual.model.layout.visualization) && props.valorCelda || state.dataviewtable === true && props.valorCelda) {
            return (
                <React.Fragment>
                    <li className="lui-list__item lui-list__action" onClick={() => { handleCopyToClipboard(); closeContextMenu(); }}>
                        <i className="lui-list__aside  item-icon  lui-icon lui-icon--copy"></i>
                        <span className="lui-list__text" title={t("contextMenu.label.copyToClipboard")}>{t("contextMenu.label.copyToClipboard")}</span>
                    </li>
                </React.Fragment>
            );
        }
    }
    //softPatches
    const SoftPatchesButton = () => {
        const isSoftPatches = state.isSoftPatches;
        if (isSoftPatches && !state.objectTypesNotSoftPatches.includes(props.visual.model.layout.visualization)) {
            return (
                <React.Fragment>
                    <li className="lui-list__item lui-list__action" onClick={() => { handleClearSoftPatches(); closeContextMenu(); }}>
                        <i className="lui-list__aside  item-icon  lui-icon  lui-icon--lui-icon lui-icon--history"></i>
                        <span className="lui-list__text" title={t("contextMenu.label.softPatches")}>{t("contextMenu.label.softPatches")}</span>
                    </li>
                </React.Fragment>
            );
        }

    };

    //Botón Expandir/contraer
    const ExpandButton = () => {
        const isPivotTable = state.isPivotTable;
        if (!isPivotTable) {
            return null;
        }
        return (
            <React.Fragment>
                <li className="lui-list__item lui-list__action  qv-contextmenu-has-submenu has-icon" onClick={() => handleShowItemsExpand()}>
                    <span className="lui-list__text ng-binding"
                        title={t("contextMenu.label.expand")}>{t("contextMenu.label.expand")}</span>
                    <i className="next-icon lui-list__aside lui-icon lui-icon--triangle-right" aria-hidden="false"></i>
                </li>
            </React.Fragment>
        );
    };

    //Boton Expand Pivot Table
    const ExpandPivotTableButton = () => {
        const isPivotTable = state.isPivotTable;
        if (isPivotTable) {
            return (
                <React.Fragment>
                    <li className="lui-list__item lui-list__action" onClick={() => handleHidetemsExpand()}>
                        <i className="lui-list__aside back-icon lui-icon  lui-icon--triangle-left"></i>
                        <span className="lui-list__text" title={t("contextMenu.label.volver")}>{t("contextMenu.label.volver")}</span>
                    </li>
                    <li className="lui-list__item lui-list__action" onClick={() => handleExpand()}>
                        <i className="lui-list__aside  item-icon  lui-icon  lui-icon--lui-icon lui-icon--plus"></i>
                        <span className="lui-list__text" title={t("contextMenu.label.expandirtodo")}>{t("contextMenu.label.expandirtodo")}</span>
                    </li>
                    <li className="lui-list__item lui-list__action" onClick={() => handleContract()}>
                        <i className="lui-list__aside  item-icon  lui-icon  lui-icon--lui-icon lui-icon--minus"></i>
                        <span className="lui-list__text" title={t("contextMenu.label.contraertodo")}>{t("contextMenu.label.contraertodo")}</span>
                    </li>
                </React.Fragment>
            );
        }

    };

    return (
        <React.Fragment>
            <div id="mz-contextmenu" ref={containerRef} style={{ top: `${props.propertiescontextmenu.top}px`, left: `${props.propertiescontextmenu.left}px` }}>
                <div className="qv-contextmenu mz-contextmenu">
                    <div className="lui-popover">
                        <ul className="lui-list">
                            {state.showItemExpand ? (
                                <ExpandPivotTableButton />
                            ) : (
                                state.showItemDownload ? (
                                    <DownloadItemsList />
                                ) : (
                                    <React.Fragment>
                                        {/* Valor Celda  */}
                                        <ValorCeldaButton />
                                        {/* SoftPatches */}
                                        <SoftPatchesButton />
                                        {/* Full Size */}
                                        <FullSizeToggleButton />
                                        {/* EXPANDIR PIVOT TABLE */}
                                        <ExpandButton />
                                        {/* VER DATOS */}
                                        <DataViewToggleButton />
                                        {/* DESCARGAS */}
                                        <DownloadButton />                                       
                                    </React.Fragment>
                                )
                            )}


                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ContextMenu;
