import React, { useState, useEffect, useContext, useRef } from 'react';
import GSenseApp from '@config/configGlobal.jsx';
import QlikContext from "@context/QlikContext"; // Importa el contexto
import HeaderContext from '@context/HeaderContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import i18n from 'i18next';
import { useTranslation } from "react-i18next";

const FiltersComponent = ({ aplication, qlikObjectID }) => {
    const { t } = useTranslation();
    const aplications = aplication;
    const [visual] = useState([]);
    const [listPaneles, setListPaneles] = useState([]);
    const [paneles, setPaneles] = useState(false);
    const { qlik, connConfig } = useContext(QlikContext);
    const { openFilter, setOpenFilter } = useContext(HeaderContext);
    const { openBookmark, setOpenBookmark } = useContext(HeaderContext);
    const { openFilterSelected, setOpenFilterSelected } = useContext(HeaderContext);
    const [listFiltros, setListFiltros] = useState([]);
    const {totalFiltros, setTotalFiltros} = useContext(HeaderContext);
    const [disabledSelections, setDisabledSelections] = useState({ back: '', forward: true });


    let initenviroment = useRef(false);
    let sesionParentFilter = useRef([]);

    useEffect(() => {
        //props.ObjectLoaded();
        setOpenFilter(false);
        setOpenFilterSelected(false);
        setOpenBookmark(false);
        loadFilter(aplication, qlikObjectID);
        getSelectionState(aplications);
        aplications.getList("SelectionObject", function (reply) {
            if (initenviroment.current == false) {
                initenviroment.current = true;
                const sessionInfo = {
                    idSession: reply.qInfo.qId,
                    app: aplications,
                    type:'Filter Component SelectionObject'
                };
                sesionParentFilter.current.push(sessionInfo) ;
                GSenseApp.addSesionParent(sessionInfo);

            }


            var arrFiltros = [];
            $.each(reply.qSelectionObject.qSelections, function (key, value) {
                var starWith = value.qField.startsWith('_')
                if (starWith) {
                    filterNoShow = filterNoShow + 1;
                } else {
                    var option = {};
                    option.index = key;
                    option.field = value.qField;
                    option.numSelected = value.qSelectedCount;
                    option.total = value.qTotal;
                    option.threshold = value.qSelectionThreshold;
                    option.selectedStr = value.qSelected;
                    option.qLocked = value.qLocked || false;
                    option.qOneAndOnlyOne = value.qOneAndOnlyOne || false;
                    option.isClear = value.qTotal === value.qStateCounts.qSelected + value.qStateCounts.qSelectedExcluded ? false : true;
                    option.isSelectAll = value.qTotal === value.qStateCounts.qSelected + value.qStateCounts.qSelectedExcluded;
                    option.isNotSelectAll = value.qTotal !== value.qStateCounts.qSelected + value.qStateCounts.qSelectedExcluded;
                    option.isSelectAny = !option.isSelectAll && !option.isNotSelectAll;
                    option.btnSelectAllDisable = option.isSelectAll || option.qOneAndOnlyOne || option.qLocked;
                    option.btnSelectAlternativeDisable = option.isSelectAll || option.qOneAndOnlyOne || option.qLocked;
                    option.btnSelectExcludedDisable = option.isSelectAll || option.qOneAndOnlyOne || option.qLocked;
                    option.btnClearDisable = !option.qLocked;
                    arrFiltros.push(option);
                }

            })
            setListFiltros(arrFiltros);
            setTotalFiltros(arrFiltros.length);
        });
        return () => {
            removeSessionSelection();
        };
        
    }, [aplication, qlikObjectID]);

    const isArrayFilters = () => {
        const newListPaneles = [];
        let newPaneles = false;
        if (Array.isArray(qlikObjectID)) {
            getAltoAcordeonFilters();
            newPaneles = true;
            for (const value of qlikObjectID) {
                const _options = {
                    title: i18n.t(value.title),
                    icon: value.icon,
                    id: value.idFiltro
                };
                newListPaneles.push(_options);
            }
        }

        setListPaneles(newListPaneles);
        setPaneles(newPaneles);
    }

    const setAltoFIlters = (mod, el) => {
        return new Promise(resolve => {
            let vis = mod;
            let _this = el;
            let _items;
            let _altoFiltro = 0;
            let _itemsLength = 0;

            _items = vis.model.pureLayout || vis.model.layout;
            if (_items) {
                _itemsLength = _items.qChildList.qItems.length;
            }
            _altoFiltro = (_itemsLength * 42) + 10;

            const parentBoxObjectFilterItem = _this.closest('#filters-panel .box_object_filter_item');
            if (parentBoxObjectFilterItem) {
                parentBoxObjectFilterItem.style.height = `${_altoFiltro}px`;
            }
            GSenseApp.addVisualObject(vis);
            resolve(true);
        });
    }

    const loadFilter = async (app) => {
        let _app = app;
        isArrayFilters();
        setTimeout(() => {
            let filtrosHome = document.querySelectorAll('.qlik-embed-filtro.filtrosHome');
            filtrosHome.forEach(async filtro => {
                const qvid = filtro.getAttribute('qlikObjectID');
                try {
                    const vis = await _app.visualization.get(qvid);
                    await setAltoFIlters(vis, filtro);
                    vis.show(filtro, {
                        onRendered: () => {
                            //console.log(vis)
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }); 
        }, 600);

    }

    const handleOnToggleFilters = () => {
        setOpenFilter(prevOpenFilter => !prevOpenFilter);
        setOpenFilterSelected(false);
    }

    const getAltoAcordeonFilters = () => {
        setTimeout(() => {
            let altoHeaders = 0;
            document.querySelectorAll('#filters-panel #cuerpoFiltros .card-header').forEach(header => {
                altoHeaders += header.offsetHeight;
            });
            const altoSection = document.querySelector('#cuerpoFiltros #accordion').offsetHeight;
            const altoItems = altoSection - altoHeaders;
            document.querySelectorAll('#filters-panel #cuerpoFiltros #accordion .innerCollapse').forEach(innerCollapse => {
                innerCollapse.style.height = `${altoItems}px`;
            });
        }, 200);
    };

    const openCollapse = (ID) => {
        setTimeout(function () {
            qlik.resize(ID);
        }, 150);
    }
    const handleToggleFiltersSelected = () => {
        setOpenFilterSelected(prevOpenFilterSelected => !prevOpenFilterSelected);
    }
    const getSelectionState = (app) => {
        const selState = app.selectionState();
        const listener = () => {
            setDisabledSelections({
                back: selState.backCount <= 1,
                forward: selState.forwardCount < 1
            });
        };
        selState.OnData.bind(listener);
    };

    const handleSelectAll = (filtro) => {
        aplications.field(filtro.field).selectAll();
    }
    const handleSelectAlternativos = (filtro) => {
        aplications.field(filtro.field).selectAlternative();
    }
    const handleSelectExcluidos = (filtro) => {
        aplications.field(filtro.field).selectExcluded();
    }
    const handleUnlockFilter = (filtro) => {
        aplications.field(filtro.field).unlock();
    }
    const handleLockFilter = (filtro) => {
        aplications.field(filtro.field).lock();
    }
    const handleClearFilter = (filtro) => {
        aplications.field(filtro.field).clear();
    }
    const handleClearAllFilter = function () {
        aplications.clearAll();
    }

    const removeSessionSelection = async () => {
        let ArrSession = sesionParentFilter.current;
        if (ArrSession && ArrSession.length >= 1) {
            try {
                // Mapea cada sesión y devuelve una matriz de promesas de destrucción de objetos de sesión
                const destructionPromises = ArrSession.map(async value => {
                    const thisApp = value.app;
                    const id = value.idSession;
                    const res = await thisApp.destroySessionObject(id);
                    return res;
                });

                // Espera a que todas las promesas se resuelvan
                await Promise.all(destructionPromises);

                // Limpia el estado una vez que todas las promesas se han resuelto

            } catch (error) {
                console.error('Error al destruir los objetos de sesión:', error);
            }
        }
    };
    return (
        <React.Fragment>
            <div id="filters-panel" className={`${openFilter ? 'active' : 'in-active'}`}>
                <div id="cabeceraFiltros">
                    <div id="box_selecciones">
                        <ul className="nav pull-right">
                            <li className="nav-item" id="linkAbreFiltros">
                                <a href="javascript:void(0)" onClick={handleToggleFiltersSelected} >
                                    <span className="selectionsButtom" >
                                        {t("filters.label.selecciones")}
                                        {openFilterSelected ? (
                                            <>
                                                <i className="ri-arrow-right-s-line"></i>
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-arrow-left-s-line"></i>
                                            </>
                                        )}
                                    </span>
                                    <span id="selectionsnotification" className="badge badge-default badgeFilterPanel">
                                        {totalFiltros}
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item liFiltrosClose" onClick={handleOnToggleFilters}>
                                <a href="javascript:void(0)" className="nav-link">
                                    <span className="selectionsButtom">
                                        <i className="lui-icon lui-icon--close"></i>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="cuerpoFiltros">
                    {paneles ? (
                        <div id="accordion">
                            {listPaneles.map((panel, index) => (
                                <div className="card" key={index}>
                                    <div className="card-header" id={`heading${index}`}>
                                        <button className="btn btn-link" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded={index === 0 ? 'true' : 'false'} aria-controls={`collapse${index}`} onClick={() => openCollapse(panel.id)}>
                                            <span className="text-header-card"><span className={`${panel.icon} ico-20 pr-2`}></span>{panel.title}</span>
                                        </button>
                                    </div>
                                    <div className={`collapse ${index === 0 ? 'show' : ''}`} id={`collapse${index}`} aria-labelledby={`heading${index}`} data-parent="#accordion">
                                        <div className="innerCollapse">
                                            <div className="card-body box_object box_object_filter_item">
                                                <div className="col-md-12">
                                                    <div className="qlik-embed-filtro filtrosHome" qlikObjectID={panel.id}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="col-md-12 box_object box_object_filter_item clearfix">
                            <div className="qlik-embed-filtro filtrosHome" qlikObjectID={qlikObjectID}></div>
                        </div>
                    )}

                </div>
                <div id="filtersTop-selections" className={openFilterSelected ? 'activo' : ''} >
                    <div className="header-filtersSelected-top">
                        <h2><i className="lui-icon lui-icon--filterpane qs-no-margin"></i>{t("filters.label.selecciones")}</h2>
                        <table className="tableFilter table-fixed">
                            <thead>
                                <tr className="optionFilters">
                                    <td>
                                        <button className="qv-subtoolbar-button borderbox" onClick={() => aplications.back()} disabled={disabledSelections.back} title="Retroceder">
                                            <i className="lui-icon lui-icon--selections-back"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="qv-subtoolbar-button borderbox" onClick={() => aplications.forward()} disabled={disabledSelections.forward} title="Avanzar">
                                            <i className="lui-icon lui-icon--selections-forward"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button id="clearselections" className="qv-subtoolbar-button borderbox" disabled={totalFiltros === 0} onClick={() => aplications.clearAll()} title="Limpiar">
                                            <i className="lui-icon lui-icon--clear-selections"></i>
                                        </button>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <ul id="selections">
                        {totalFiltros >= 1 &&
                            <li className="list-filters-selected">
                                <ul className="inner-selected">
                                    {listFiltros.map(filtro => (
                                        <li className='selected-field-container clearfix' id={filtro.field}>
                                            <div className='row m-0 wrapper'>
                                                <div className='col-sm-12 col-xs-12 p-0'>
                                                    <span className='label label-info selected-field'><span className="lui-icon lui-icon--filterpane qs-no-margin" aria-hidden="true"></span> {filtro.field}</span>
                                                    <p className='selectedelements m-0'>
                                                        {filtro.selectedStr}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row m-0">
                                                <table className="tableFilter table-fixed">
                                                    <thead>
                                                        <tr className="optionFilters">
                                                            <td>
                                                                <button className="clearBtn" onClick={() => handleSelectAll(filtro)} disabled={filtro.btnSelectAllDisable} title={t("filters.label.todos")}>
                                                                    <i className="lui-icon lui-icon--select-all"></i>
                                                                </button>
                                                            </td>

                                                            <td>
                                                                <button className="clearBtn" onClick={() => handleSelectAlternativos(filtro)} disabled={filtro.btnSelectAlternativeDisable} title={t("filters.label.alternativos")}>
                                                                    <i className="lui-icon lui-icon--select-alternative"></i>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button className="clearBtn" onClick={() => handleSelectExcluidos(filtro)} disabled={filtro.btnSelectExcludedDisable} title={t("filters.label.excluidos")}>
                                                                    <i className="lui-icon lui-icon--select-excluded"></i>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                {filtro.qLocked ? (
                                                                    <button className="clearBtn" onClick={() => handleUnlockFilter(filtro)} title={t("filters.label.desbloquear")}>
                                                                        <i className="lui-icon lui-icon--lock unlock-field"></i>
                                                                    </button>
                                                                ) : (
                                                                    <button className="clearBtn" onClick={() => handleLockFilter(filtro)} title={t("filters.label.bloquear")}>
                                                                        <i className="lui-icon lui-icon--unlock"></i>
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button className="clearBtn" onClick={() => handleClearFilter(filtro)} disabled={!filtro.btnClearDisable} title={t("filters.label.borrar")}>
                                                                    <i className="lui-icon lui-icon--bin clear-field"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </thead>

                                                </table>
                                            </div>
                                        </li>
                                    ))}

                                </ul>
                            </li>
                        }
                        {totalFiltros === 0 &&
                            <li id="emptyFilters">{t('filters.label.nofiltros')}</li>
                        }
                        {totalFiltros != 0 &&
                            <li className='clear-all' onClick={() => handleClearAllFilter()}>
                                <div className='mz-btn-dark'>{t("filters.label.limpiarselecciones")}
                                </div>
                            </li>
                        }
                        
                    </ul>
                </div>

            </div>
        </React.Fragment>
    );
}
export default FiltersComponent;
