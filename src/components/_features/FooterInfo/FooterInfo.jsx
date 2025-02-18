import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import GSenseApp from '@config/configGlobal';
import { Tooltip } from 'devextreme-react/tooltip';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale'; // Importa los locales que necesites

function FooterInfo() {
    const { t , i18n} = useTranslation();
    const [reloadTime, SetReloadTime] = useState('');
    const idioma = i18n.language;
    const tooltipAttributes = useMemo(() => {
        return {
            class: 'mz-tooltip mz-tooltip-right'
        }
    }, []);



    useEffect(() => {
        loadInfoFooter();
    }, [reloadTime]);
    const loadInfoFooter = () =>{
        let _reloadTime = GSenseApp.Qlikproperties.LASTRELOADTIME;
        SetReloadTime(_reloadTime);
    }

    const getDateFormatted = (date) => {
        if(date){        
            const locale = idioma === 'es' ? es : enUS; // Selecciona el locale según el idioma
            return format(new Date(date), 'PPPpp', { locale });
        }
    };



    return (
        <React.Fragment>
            <div id="footer-menu">
                <div id="footer-options">
                    <div className="mz-list-options">
                        <div className="item-option">
                            <div className="item-header-options">
                                <p>{t('common.Common.LastReloadTime')}:</p>
                                <span>{getDateFormatted(reloadTime)}</span>
                            </div>

                            <div className="lastUpdate" id="app-last-update">
                                <svg className="svg-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z" />
                                </svg>
                            </div>
                            <Tooltip
                                wrapperAttr={tooltipAttributes}
                                target="#app-last-update"
                                showEvent="mouseenter"
                                hideEvent="mouseleave"
                                position="right"
                                hideOnOutsideClick={false}
                            >
                                <p><label> {t('common.Common.LastReloadTime')}</label></p>
                                <p><label className='label-time' title={getDateFormatted(reloadTime)}>{getDateFormatted(reloadTime)}</label></p>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default FooterInfo;
