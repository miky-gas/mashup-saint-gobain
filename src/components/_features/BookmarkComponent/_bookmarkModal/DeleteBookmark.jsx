import React, { useCallback, useState,useEffect } from 'react';
import { useTranslation } from "react-i18next";
import GSenseApp from '@config/configGlobal.jsx';
import { getPersonalMode } from '@utils/utils';
import Notify from 'devextreme/ui/notify';

function DeleteBookmark(props) {
    const { t } = useTranslation();
    const aplications = props.aplication;
    const idBookmark = props.bookmark;
    useEffect(() => {
        props.onDatosListos();
    }, []);
    const handleConfirm = async ()=>{
        handleClose();
        const IsPersonalMode = await getPersonalMode(GSenseApp.Qlikproperties.QS, GSenseApp.Qlikproperties.QSCON);
        if (IsPersonalMode) {
            aplications.bookmark.remove(idBookmark).then(function () {
                aplications.doSave(); 
                handleShowNotify(t('bookmark.bookmarkEliminado'),'success');                                                                                                                                                              
            }).catch(error => {
                handleShowNotify(t('bookmark.bookmarkEliminadoError'),'error');
            });
        } else {
            aplications.bookmark.remove(idBookmark).then(function () {
                handleShowNotify(t('bookmark.bookmarkEliminado'),'success');                                                                                                                                                                
            }).catch(error => {
                handleShowNotify(t('bookmark.bookmarkEliminadoError'),'error');
            });
        }
    }
    const handleClose = () => {
        props.onCloseModal();
    };


    const handleShowNotify = useCallback((message,type) => {
        Notify(
            {
                message: message,
                height: 'auto',
                minHeight:45,
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
                position:'center'
            },
            
        );
        
    }, [idBookmark])
    
    return (
        <React.Fragment>
            <div className='mz-dialog__body'>
                <strong>{t('bookmark.eliminaraBookmar')}</strong>. 
                <br />
                {t('bookmark.accionnoback')}
            </div>
            <div className='mz-dialog__footer'>
                <button onClick={(e) => { e.preventDefault(); handleClose(); }} name="cancel" className="lui-button lui-dialog__button">{t("common.Common.Cancel")}</button>
                <button onClick={(e) => { e.preventDefault(); handleConfirm(); }} name="confirm" autoFocus="autofocus" className="lui-button lui-dialog__button">{t("common.Common.Aceptar")}</button>                
            </div>
        </React.Fragment>
    );
}

export default DeleteBookmark;
