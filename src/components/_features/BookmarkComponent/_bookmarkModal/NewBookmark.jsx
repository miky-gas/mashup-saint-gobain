import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import GSenseApp from '@config/configGlobal.jsx';
import { getPersonalMode } from '@utils/utils';
import Notify from 'devextreme/ui/notify';
import { Trans } from 'react-i18next';

function NewBookmark(props) {
    const { t } = useTranslation();
    const aplications = props.aplication;
    //Check guardar página y marcador predefinido por el usuario
    const [sheetLocationChecked, setSheetLocationChecked] = useState(false);
    const [bookmarkByUserChecked, setBookmarkByUserChecked] = useState(false);

    //Campos a guardar
    const [titleBookmark, setTitleBookmark] = useState('');
    const [descBookmark, setDescBookmark] = useState('');
    const [sheetLocation, setSheetLocation] = useState('');

    useEffect(() => {
        props.onDatosListos();
    }, []);

    

    //Comprobamos si hay un marcador predefinido por el usuario
    const bookmarkByUserExist = GSenseApp.BOOKMARKLIST.some((state) => state.isDefaultBookmarkByUser);
    //Obtenemos el marcador predefinido por el usuario, si existe
    const _bookmarkDefaultUserItem = GSenseApp.BOOKMARKLIST.find((state) => state.isDefaultBookmarkByUser == true);

    // Función para añadir el marcador
    const handleConfirm = async () => {
        //Comprobamos que el título se ha introducido
        if (!titleBookmark) {
            handleShowNotify(t('bookmark.KObookmark'),'warning');
            return;
        }
    
        //Comprobamos que el título no se repite
        const bookmarkExists = GSenseApp.BOOKMARKLIST.some(item => item.title === titleBookmark);        
        if (bookmarkExists) {
            handleShowNotify(t('bookmark.Bookmarkexiste'),'warning');
            document.getElementById('bmtitle').focus();
            return;
        }
    
        try {
            handleClose();
            let sheetToSet = sheetLocation;
            if (bookmarkByUserChecked) {
                setSheetLocationChecked(false);
            } else if (sheetLocationChecked) {
                sheetToSet = props.sheetlocation;
            }
            if(bookmarkByUserChecked && bookmarkByUserExist){
                await updateBookmarkDefaultUser(_bookmarkDefaultUserItem);
            }

            
            await createBookmark(titleBookmark, descBookmark, sheetToSet, bookmarkByUserChecked);
            //Comprobamos si estamos en local o producción
            let IsPersonalMode = await getPersonalMode(GSenseApp.Qlikproperties.QS, GSenseApp.Qlikproperties.QSCON);
            if (IsPersonalMode) {
                aplications.doSave();
            }
            handleShowNotify(t('bookmark.OKbookmark'),'success');
        } catch (error) {
            handleClose();
            handleShowNotify(t('bookmark.ErrorCreatingBookmark'),'error');
        }
    };
    
    const handleClose = () => {
        props.onCloseModal();
    };

    const createBookmark = (titulo, descripcion, pagina, bookmarkDefaultUser) => {
        return new Promise((resolve, reject) => {
            const bookmarkData = {
                qInfo: {
                    qType: "bookmark"
                },
                qMetaDef: {
                    title: titulo,
                    description: descripcion,
                    sheetId: pagina,
                    isUserPred: bookmarkDefaultUser,                    
                    isLocation: sheetLocationChecked,
                },
                sheetId: pagina,
                description: descripcion,
                creationDate: (new Date()).toISOString()
            };
    
            aplications.model.engineApp.createBookmark(bookmarkData)
                .then(() => resolve(true))
                .catch(error => reject(error));
        });
    };
    const updateBookmarkDefaultUser = (bookmark)=>{
        return new Promise(async function (resolve, reject) {
            aplications.model.engineApp.getBookmark(
                {
                    "qId": bookmark.id
                }
            ).then(function(qBook){
                qBook.getProperties().then(function(reply){
                    reply.qMetaDef.isUserPred = false;
                                                                                            
                    qBook.setProperties(reply).then(async function(){ 
                        //Comprobamos si estamos en local o producción
                        let IsPersonalMode = await getPersonalMode(GSenseApp.Qlikproperties.QS, GSenseApp.Qlikproperties.QSCON);                                                                                 
                        if (IsPersonalMode) {
                            aplications.doSave();
                        }                                   
                        resolve();
                    }).catch((function(e) {
                        throw new Error(e)
                    }))                                                                 
                })                            
            })
            
        })
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
            <div className='lui-dialog-mz'>
                <div className='mz-dialog__body'>
                    <label className="control-label" for="bmtitle">{t('bookmark.modal.titulo')}</label>
                    <input 
                        className="lui-input" 
                        id="bmtitle" 
                        type="text"
                        value={titleBookmark} 
                        onChange={(e) => setTitleBookmark(e.target.value)}
                        autofocus />
                    <label className="control-label" for="bmdesc">{t('bookmark.modal.descripcion')} <span className="opacity">{t('bookmark.modal.opcional')}</span></label>
                    <textarea 
                        className="lui-textarea" 
                        id="bmdesc" 
                        type="text" 
                        tabindex="0"
                        value={descBookmark} 
                        onChange={(e) => setDescBookmark(e.target.value)} 
                        maxlength="512">
                    </textarea>
                    <label className="label-switch" disabled={bookmarkByUserChecked}>
                        <div className="label-switch-toggle">
                            <input
                                className="toggle-state"
                                type="checkbox"
                                name="sheetLocation"
                                value="1"
                                aria-label="Label"
                                id="sheetLocation"
                                checked={sheetLocationChecked}
                                onChange={() => setSheetLocationChecked(!sheetLocationChecked)}
                                disabled={bookmarkByUserChecked}
                            />
                            <div className="indicator"></div>
                        </div>
                        <div className="label-switch-text">{t('bookmark.modal.hoja')}</div>
                    </label>
                    <label className="label-switch">
                        <div className="label-switch-toggle">
                            <input 
                                className="toggle-state" 
                                type="checkbox" 
                                name="bookmarkDefaultUser" 
                                value="1" 
                                aria-label="Label" 
                                id="bookmarkDefaultUser" 
                                checked={bookmarkByUserChecked} 
                                onChange={() => setBookmarkByUserChecked(!bookmarkByUserChecked)}
                                />
                            <div className="indicator"></div>
                        </div>
                        <div className="label-switch-text">{t('bookmark.modal.guardarByUser')}</div>
                    </label>
                    {bookmarkByUserExist && bookmarkByUserChecked ? (
                    <div className="sectionBookmarkByUserExist">
                        <Trans>
                            {t('bookmark.BookmarkByUserExist')}
                        </Trans>
                        
                    </div>
                ) : null}
                </div>
                <div className='mz-dialog__footer'>
                    <button onClick={(e) => { e.preventDefault(); handleClose(); }} name="cancel" className="lui-button lui-dialog__button">{t("common.Common.Cancel")}</button>
                    <button onClick={(e) => { e.preventDefault(); handleConfirm(); }} name="confirm" autoFocus="autofocus" className="lui-button lui-dialog__button">{t("common.Common.Aceptar")}</button>                    
                </div>
            </div>
        </React.Fragment>
    );
}

export default NewBookmark;
