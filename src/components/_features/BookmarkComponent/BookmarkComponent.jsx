import React, { useState, useEffect, useContext, useCallback, Suspense, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useRouter } from "@uirouter/react";
import { useTranslation } from "react-i18next";
import Notify from 'devextreme/ui/notify';

import { QlikProvider } from "@context/QlikContext.jsx";
import QlikContext from "@context/QlikContext"; // Importa el contexto
import HeaderContext from '@context/HeaderContext';

import { getPersonalMode } from '@utils/utils';
import GSenseApp from '@config/configGlobal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import store, { activarBookmark, desactivarBookmark } from '@store/store'; // Importa tu store Redux

import i18next from 'i18next';
import useDateFormatter from '@hooks/useDateFormatter'; // Importa el hook
const ModalComponent = React.lazy(() => import('@components/_features/ModalComponent/ModalComponent.jsx'));

const BookmarkComponent = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const idioma = i18next.language;
    const { getDateFormatted } = useDateFormatter(); // Usa el hook
    const isHideHeader = props.hideHeader;
    const aplications = props.aplication;
    const { openFilter, setOpenFilter } = useContext(HeaderContext);
    const { openBookmark, setOpenBookmark } = useContext(HeaderContext);
    const [listBookmark, setListBookmark] = useState([]);
    const [defaultBookmarkId, setDefaultBookmarkId] = useState('');
    const [bookmarkActivo, setBookmarkActivo] = useState('');
    const [sesionParentBookmark, setSesionParentBookmark] = useState([]);
    const [sesionParentSelection, setSesionParentSelection] = useState([]);
    const [isLoading, setIsLoading] = useState(false);//esperamos a la carga de los bookmark

    const { qlik, connConfig } = useContext(QlikContext);

    const ROUTER = useRouter();
    const STATES = ROUTER.stateService.get();
    const [stateCurrentName] = useState(ROUTER.globals.current.name);

    let initenviroment = useRef(false);
    let initenviromentSelections = useRef(false);

    // useEffect(() => {
    //     // Suscribirse al store
    //     const unsubscribe = store.subscribe(() => {
    //         let estadoBookmar = store.getState().bookmarkActivo;
    //         //console.log(estadoBookmar, 'estado');
    //     });    
    //     // Función de limpieza
    //     return () => {
    //         unsubscribe();
    //     };
    // }, []);

    useEffect(() => {
        setOpenFilter(false);
        setOpenBookmark(false);
        
        // console.log(ROUTER.globals.current.name, 'useRouter') 
        // console.log(ROUTER.stateService.getCurrentPath(), 'useRouter get') 

        aplications.getList("BookmarkList", async function (reply) {
            if (initenviroment.current == false) {
                initenviroment.current = true;
                let sessionInfoBookmark = {};
                //await removeSessionBookmark();
                sessionInfoBookmark = {
                    idSession: reply.qInfo.qId,
                    app: aplications,
                    type: 'BookmarkList Bookmark Componenet'
                };
                setSesionParentBookmark(prevState => [...prevState, sessionInfoBookmark]);
                GSenseApp.addSesionParent(sessionInfoBookmark);            
            }


            let bookmarkList = [];
            const IsPersonalMode = await getPersonalMode(GSenseApp.Qlikproperties.QS, GSenseApp.Qlikproperties.QSCON);
            await Promise.all(reply.qBookmarkList.qItems.map(async (value, key) => {

                if (!value.qMeta.hasOwnProperty('extensionId')) {
                    let itemBookmark = {};
                    let setAnalysisBookmark = await getAnalysis(value.qInfo.qId);

                    itemBookmark.index = key;
                    itemBookmark.title = value.qData.title;
                    itemBookmark.description = value.qData.description;
                    itemBookmark.sheetId = value.qData.sheetId;
                    itemBookmark.hasLocation = value.qMeta?.isLocation || false;
                    itemBookmark.id = value.qInfo.qId;
                    itemBookmark.selectionFields = value.qData.selectionFields || await getselectionFields(value.qData.qBookmark.qStateData[0].qFieldItems);
                    itemBookmark.creationDate = value.qData.creationDate;
                    itemBookmark.isDefaultBookmark = GSenseApp.DEFAULTBOOKMARID == value.qInfo.qId ? true : false;
                    itemBookmark.defaultBookmarkId = GSenseApp.DEFAULTBOOKMARID == value.qInfo.qId ? GSenseApp.DEFAULTBOOKMARID : '';

                    itemBookmark.isDefaultBookmarkByUser = value.qMeta?.isUserPred || false;
                    itemBookmark.setAnalysis = setAnalysisBookmark;

                    if (!IsPersonalMode) {
                        itemBookmark.owner = value.qMeta?.owner?.userId || '';
                        itemBookmark.ownername = value.qMeta?.owner?.name || '';
                        itemBookmark.published = value.qMeta?.published == true;
                        itemBookmark.canDelete = value.qMeta?.privileges ? value.qMeta.privileges.includes("delete") : false;
                        itemBookmark.canPublish = value.qMeta?.privileges ? value.qMeta.privileges.includes("publish") : false;
                        itemBookmark.canUpdate = value.qMeta?.privileges ? value.qMeta.privileges.includes("update") : false;
                    } else {
                        itemBookmark.owner = '';
                        itemBookmark.ownername = '';
                        itemBookmark.published = false;
                        itemBookmark.canDelete = true;
                        itemBookmark.canPublish = false;
                        itemBookmark.canUpdate = true;
                    }

                    if (!itemBookmark.isDefaultBookmark) {
                        itemBookmark.active = false;
                    } else {
                        itemBookmark.active = true;
                        setDefaultBookmarkId(value.qMeta.defaultBookmarkId);
                    }
                    bookmarkList.push(itemBookmark);
                    // console.log(itemBookmark, 'itemBookmark')
                }
            }));
            setListBookmark([]);
            //Pasamos los marcadores de la aplicación para poder consultarlos en cualquier coomponente sin tener que pasar por el CONTEXT
            GSenseApp.BOOKMARKLIST = [...bookmarkList];
            setListBookmark(prevList => [...prevList, ...bookmarkList]);
            setIsLoading(true);
        });
        return () => {
            // Limpiar sesionParentBookmark cuando el componente se desmonta
            setSesionParentBookmark([]);
        };
    }, [aplications, idioma]);


    useEffect(() => {
        aplications.getList("SelectionObject", async function (reply) {
            if (initenviromentSelections.current == false) {
                initenviromentSelections.current = true;
                let sessionInfoSelection = {};
                //await removeSessionSelection();
                sessionInfoSelection = {
                    idSession: reply.qInfo.qId,
                    app: aplications,
                    type: 'SelectionObject Bookmark Component'
                };
                setSesionParentSelection(prevState => [...prevState, sessionInfoSelection]);
                GSenseApp.addSesionParent(sessionInfoSelection);           
            }




            getAnalysis().then((res) => {
                var setAnalysisScript = res;
                let foundMatch = false; // Bandera para indicar si se encontró una coincidencia
                if (!setAnalysisScript || !GSenseApp.BOOKMARKLIST) {
                    setBookmarkActivo(null); // Establecer null si no se encontró ninguna coincidencia
                    dispatch(desactivarBookmark());
                    return false;
                }
                GSenseApp.BOOKMARKLIST.forEach(bookmark => {
                    areStringsEqual(bookmark.setAnalysis, setAnalysisScript).then(result => {
                        if (result == true) {
                            dispatch(activarBookmark(bookmark.title));
                            setBookmarkActivo(bookmark.id); // Actualiza la propiedad 'active' a true
                            foundMatch = true; // Se encontró una coincidencia
                        }
                    });

                });
                if (!foundMatch) {
                    setBookmarkActivo(null); // Establecer null si no se encontró ninguna coincidencia
                    dispatch(desactivarBookmark());

                }
            })
        })


        function processString(str) {
            return new Promise((resolve, reject) => {
                if(str){
                    try {
                        // Eliminar los caracteres de envoltura < y >
                        str = str.slice(1, -1);
    
                        // Separar la cadena por el símbolo ',' precedido por '}'
                        let segments = str.split(/},/).map(segment => segment.trim() + '}');
    
                        // Dividir cada segmento por '=' y procesar las selecciones
                        let processedSegments = segments.map(segment => {
                            let [key, value] = segment.split('=');
                            key = key.trim();
                            value = value.replace(/[\{\}]/g, '').split(',').map(item => item.trim()).sort();
                            return { key, value };
                        });
    
                        resolve(processedSegments);
                    } catch (error) {
                        reject(error);
                    }
                }else{
                    resolve();
                }

            });
        }

        async function areStringsEqual(str1, str2) {
            return Promise.all([processString(str1), processString(str2)])
                .then(processedStrings => {
                    const [processedStr1, processedStr2] = processedStrings;

                    // Verificar que las claves (tipo) sean las mismas
                    const keys1 = processedStr1.map(item => item.key).sort();
                    const keys2 = processedStr2.map(item => item.key).sort();

                    if (JSON.stringify(keys1) !== JSON.stringify(keys2)) {
                        return false;
                    }

                    // Verificar que los valores (selecciones) sean los mismos
                    for (let i = 0; i < processedStr1.length; i++) {
                        const values1 = processedStr1[i].value;
                        const values2 = processedStr2.find(item => item.key === processedStr1[i].key).value;

                        if (JSON.stringify(values1) !== JSON.stringify(values2)) {
                            return false;
                        }
                    }

                    return true;
                })
                .catch(error => {
                    //console.log("Error al comparar cadenas:", error);
                    return false;
                });
        }


        return () => {
            // Limpiar sesionParentSelection cuando el componente se desmonta
            setSesionParentSelection([]);
        };
    }, [isLoading]);
    const removeSessionBookmark = async () => {
        if (sesionParentBookmark && sesionParentBookmark.length >= 1) {
            try {
                console.log('Entra sesionParentBookmark ' + sesionParentBookmark);
                // Mapea cada sesión y devuelve una matriz de promesas de destrucción de objetos de sesión
                const destructionPromises = sesionParentBookmark.map(async value => {
                    const thisApp = value.app;
                    const id = value.idSession;
                    const res = await thisApp.destroySessionObject(id);
                });

                // Espera a que todas las promesas se resuelvan
                await Promise.all(destructionPromises);

                // Limpia el estado una vez que todas las promesas se han resuelto
                setSesionParentBookmark([]);
            } catch (error) {
                console.error('Error al destruir los objetos de sesión:', error);
            }
        }
    };


    const removeSessionSelection = async () => {
        if (sesionParentSelection && sesionParentSelection.length >= 1) {
            try {
                // Mapea cada sesión y devuelve una matriz de promesas de destrucción de objetos de sesión
                const destructionPromises = sesionParentSelection.map(async value => {
                    const thisApp = value.app;
                    const id = value.idSession;
                    const res = await thisApp.destroySessionObject(id);
                    return res;
                });

                // Espera a que todas las promesas se resuelvan
                await Promise.all(destructionPromises);

                // Limpia el estado una vez que todas las promesas se han resuelto
                setSesionParentSelection([]);
            } catch (error) {
                console.error('Error al destruir los objetos de sesión:', error);
            }
        }
    };


    const eliminarComentariosBloque = (cadena) => {
        return cadena.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    const getAnalysis = (IDBOOKMARK) => {
        return new Promise(resolve => {
            aplications.model.engineApp.getSetAnalysis(
                {
                    "qBookmarkId": IDBOOKMARK
                }
            ).then(function (qBook) {
                resolve(eliminarComentariosBloque(qBook.qSetExpression));
            })
        })
    }
    const getselectionFields = (datos) => {
        return new Promise(resolve => {
            let _selectionFields = datos.map(match => match.qDef.qName).join(',');
            resolve(_selectionFields);
        });
    }
    const handleToggleBookmark = () => {
        setOpenBookmark(prevOpenBookmark => !prevOpenBookmark);
    }
    const handleApplyBookmark = (ID, bookmar) => {
        if (bookmar.sheetId) {
            let havesheetId = STATES.filter((state) => state.name == bookmar.sheetId).length > 0;
            if (havesheetId) {
                ROUTER.stateService.go(bookmar.sheetId);
            }
        }
        aplications.bookmark.apply(ID);
    }
    const handleCloseModal = () => {
        const modal = document.getElementById('mz-modal');
        if (modal) {
            modal.remove();
            return true;
        } else {
            return false;
        }
    };
    const handleDeleteBookmark = (type, title, width, height, idBookmark) => {
        let div = document.createElement('div');
        div.classList.add('mz-modal');
        div.id = 'mz-modal';
        document.body.prepend(div);
        const root = createRoot(document.getElementById("mz-modal"));
        root.render(<Suspense fallback={<div className='momentum transparent'></div>}><QlikProvider><ModalComponent onCloseModal={() => handleCloseModal()} aplication={aplications} bookmark={idBookmark} type={type} title={title} width={width} height={height}></ModalComponent></QlikProvider></Suspense>)
    }

    const handleNewBookmark = (type, title, width, height, currentName) => {
        let div = document.createElement('div');
        div.classList.add('mz-modal');
        div.id = 'mz-modal';
        document.body.prepend(div);
        const root = createRoot(document.getElementById("mz-modal"));
        root.render(<Suspense fallback={<div className='momentum transparent'></div>}><QlikProvider><ModalComponent onCloseModal={() => handleCloseModal()} aplication={aplications} type={type} title={title} width={width} height={height} sheetlocation={currentName}></ModalComponent></QlikProvider></Suspense>)
    }
    const handleEditBookmark = (type, title, width, height, bookmark, currentName) => {
        let div = document.createElement('div');
        div.classList.add('mz-modal');
        div.id = 'mz-modal';
        document.body.prepend(div);
        const root = createRoot(document.getElementById("mz-modal"));
        root.render(<Suspense fallback={<div className='momentum transparent'></div>}><QlikProvider><ModalComponent onCloseModal={() => handleCloseModal()} aplication={aplications} type={type} title={title} width={width} height={height} bookmark={bookmark} currensheetlocation={currentName}></ModalComponent></QlikProvider></Suspense>)
    }

    const handlePublishBookmark = async (bookmark) => {
        try {
            const qBook = await aplications.model.engineApp.getBookmark(bookmark.id);
            await qBook.publish();
            handleShowNotify(t('bookmark.OKpublishBookmark'), 'success');
        } catch (err) {
            handleShowNotify(t('bookmark.KOpublishBookmark'), 'error');
        }
    }

    const handleUnPublishBookmark = async (bookmark) => {
        try {
            const qBook = await aplications.model.engineApp.getBookmark(bookmark.id);
            await qBook.unPublish();
            handleShowNotify(t('bookmark.OKunPublishBookmark'), 'success');
        } catch (err) {
            handleShowNotify(t('bookmark.KOunpublishBookmark'), 'error');
        }
    }


    const handleShowNotify = useCallback((message, type) => {
        Notify(
            {
                message: message,
                height: 'auto',
                minHeight: 45,
                width: 'auto',
                minWidth: 150,
                type: type,
                displayTime: 3500,
                animation: {
                    show: {
                        type: 'fade',
                        duration: 400,
                        from: 0,
                        to: 1,
                    },
                    hide: { type: 'fade', duration: 40, to: 0 },
                },
            },
            {
                position: 'center'
            },

        );

    }, [])


    return (
        <React.Fragment>
            <div className={`list-bookmark ${openBookmark ? 'active' : 'in-active'}`}>
                {!isHideHeader && (
                    <div className="mz-header-bookmark">
                        <h2><i className="lui-icon  lui-icon--bookmark float-left"></i> Bookmark</h2>
                        <div className="nav-item liBookmarkClose" onClick={() => handleToggleBookmark()}>
                            <a href="javascript:void(0)" className="nav-link">
                                <span className="selectionsButtom">
                                    <i className="lui-icon lui-icon--close"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                )}

                <div className="wrapper-bookmark">

                    {listBookmark.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)).map(bookmark => (
                        <div key={bookmark.id} className={`item-bookmark ${bookmarkActivo == bookmark.id ? 'active' : ''}`} data-rel={bookmark.id} data-active={bookmarkActivo}>
                            <div className="content-options">
                                <div className="coverbookmar" onClick={() => handleApplyBookmark(bookmark.id, bookmark)} title={t('bookmark.aplicarmarcadores')}></div>
                                <div className="info-bokkmark">
                                    <span className="title-bookmark">{bookmark.title}</span>
                                    {bookmark.isDefaultBookmarkByUser && <span className="bm-val">{t("bookmark.StartBookmarkHint")}</span>}
                                    {bookmark.description && (
                                        <div className="item-bookmark-description item-bookmark-info">
                                            <span><span className="lui-icon lui-icon--edit"></span> {t('bookmark.descripcion')}: </span>
                                            {bookmark.description}
                                        </div>
                                    )}
                                    {bookmark.selectionFields && (
                                        <div className="item-bookmark-selectionFields item-bookmark-info">
                                            <span><span className="lui-icon lui-icon--database"></span> {t('bookmark.selecciones')}: </span>
                                            {bookmark.selectionFields}
                                        </div>
                                    )}
                                    {bookmark.creationDate && (
                                        <div className="item-bookmark-creationDate item-bookmark-info">
                                            <span><span className="lui-icon lui-icon--calendar"></span> {t('bookmark.fechaCreacion')}: </span>
                                            {getDateFormatted(bookmark.creationDate)}                                            
                                        </div>
                                    )}
                                    {bookmark.isDefaultBookmark && <div className="lui-tag" title={t('bookmark.title.StartBookmark')}>{t("bookmark.label.StartBookmark")}</div>}
                                    {bookmark.isDefaultBookmarkByUser && <div className="lui-tag" title={t("bookmark.label.StartBookmarkUser")}>{t("bookmark.label.StartBookmarkUser")}</div>}
                                </div>
                                <div className="options-bookmark">
                                    {!bookmark.isDefaultBookmark && <button className="item-option-bookmark" onClick={() => handleDeleteBookmark('deletebookmark', t("common.Common.Atencion"), 600, 200, bookmark.id)} disabled={!bookmark.canDelete} title={t('common.Common.Eliminar')}><i className="lui-icon lui-icon--bin"></i></button>}
                                    {!bookmark.isDefaultBookmark && !bookmark.isDefaultBookmarkByUser && bookmark.canPublish && !bookmark.published && <button className="item-option-bookmark" onClick={() => handlePublishBookmark(bookmark)} title={t('bookmark.publicarmarcador')}><i style={{ color: '#0eb921' }} className="lui-icon lui-icon--unlock"></i></button>}
                                    {!bookmark.isDefaultBookmark && !bookmark.isDefaultBookmarkByUser && bookmark.canPublish && bookmark.published && <button className="item-option-bookmark" onClick={() => handleUnPublishBookmark(bookmark)} title={t('bookmark.despublicarmarcador')}><i style={{ color: '#ce2121' }} className="lui-icon lui-icon--lock"></i></button>}
                                    {!bookmark.isDefaultBookmark && <button className="item-option-bookmark" onClick={() => handleEditBookmark('editbookmark', t('bookmark.editarmarcadores'), 600, 200, bookmark, stateCurrentName)} title={t('bookmark.editarmarcadores')} disabled={!bookmark.canUpdate}><i className="lui-icon lui-icon--edit"></i></button>}
                                    <button className="item-option-bookmark item-option-bookmark-active" onClick={() => handleApplyBookmark(bookmark.id, bookmark)} title={t('bookmark.aplicarmarcadores')}><i className="lui-icon lui-icon--tick"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div id="mz-add-bookmark">
                    <button className="mz-btn-dark" onClick={() => handleNewBookmark('newbookmark', t("bookmark.newbookmark"), 600, 200, stateCurrentName)}><i className="lui-icon  lui-icon--plus float-left"></i> {t("bookmark.newbookmark")}</button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default BookmarkComponent;
