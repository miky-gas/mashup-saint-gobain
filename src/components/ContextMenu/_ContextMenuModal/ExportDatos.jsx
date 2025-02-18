import React, { useState, useEffect } from 'react';
import {arrAppsControl} from "@routes/_routes.jsx";
import { useTranslation } from "react-i18next";

function ExportDatos(props) {
    const { t } = useTranslation();
    const [URLDOWNLOAD, setURLDOWNLOAD] = useState(null);

    useEffect(() => {
        let _app = props.aplication;
        const ID = props.qlikObjectID;
        _app.visualization.get(ID).then((visual) => {
            let isContainer = visual.model.genericType == 'container' ? true : false;
            if (isContainer) {
                visual.model.getProperties().then(() => {
                    let activeObjectFromContainer = visual.model.items.activeId;
                    _app.visualization.get(activeObjectFromContainer).then((visual) => {
                        visual.exportData({ state: 'A', format: 'OOXML' }).then((result) => { 
                            setURLDOWNLOAD(result);
                            props.onDatosListos();                 
                        }).catch((error) => {
                            console.log(error);
                        });
                    });
                });
            } else {
                visual.exportData({ state: 'A', format: 'OOXML' }).then((result) => {
                    setURLDOWNLOAD(result);
                    props.onDatosListos(); 
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }, []);

    const handleClose = () => {
        props.onCloseModal();
    };
    return (
        <React.Fragment>
            <div className='mz-dialog__body'>
                <p className="pb-10">
                    {t("Export.CompletedDescription")}
                </p>
                <p className="pb-10">
                    <a className="export-url" href={URLDOWNLOAD} target="_blank">{t("Export.CompletedLink")}</a>
                </p>                
            </div>
            <div className='mz-dialog__footer'>
                <button onClick={(e) => { e.preventDefault(); handleClose(); }} name="cancel" className="lui-button lui-dialog__button">{t("common.Common.Cerrar")}</button>
                
            </div>
        </React.Fragment>
    );
}

export default ExportDatos;
