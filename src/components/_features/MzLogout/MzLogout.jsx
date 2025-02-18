import React, { useContext, useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import QlikContext from "@context/QlikContext";
import { useTranslation } from 'react-i18next';

const MzLogout = () => {
    const { t } = useTranslation();
    const { qlik, connConfig } = useContext(QlikContext);
    const [popupVisible, setPopupVisible] = useState(false);

    const handleShowLogoutConfirm = () => {
        setPopupVisible(true);
    };

    const handleCloseDialog = () => {
        setPopupVisible(false);
    };

    const handleLogout = async () => {
        const href = window.location.pathname;
        const prefix = href.substr(0, href.toLowerCase().lastIndexOf("/extensions") + 1) || "/";
        try {
            const reply = await qlik.getGlobal().isPersonalMode();

            if (reply.qReturn) {
                handleCloseDialog();
                window.close();
            } else {
                const res = await fetch(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${prefix}qps/user`);
                const locationUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${prefix}qps/`;
                const logoutUri = `${window.location.protocol}//${window.location.hostname}/hub/`;

                await fetch(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${prefix}qps/user`, {
                    method: 'DELETE',
                });
                window.location.replace(`${locationUrl}logout?targetUri=${logoutUri}`);
            }
        } catch (err) {
            handleCloseDialog();
            console.error(err);
        }
    };


    return (
        <div>
            <div className="item-option" onClick={handleShowLogoutConfirm}>
                <div className="item-header-options">
                    <span className="title-option title-option-Glossary">
                        <span className="txt-xs"><span className="lui-icon lui-icon--log-out qs-no-margin" aria-hidden="true"></span></span>
                    </span>
                </div>
            </div>
            <Popup
                visible={popupVisible}
                onHiding={handleCloseDialog}
                dragEnabled={false}
                showCloseButton={false}
                showTitle={false}
                width={600}
                height={300}
            >
                <div className='mz-dialog__body'>
                    <p className='textLogout'>{t('common.Common.logoutconfirm')}</p>
                </div>
                <div
                 className='mz-dialog__footer'>
                    <button onClick={(e) => { e.preventDefault(); handleCloseDialog(); }} name="cancel" className="lui-button lui-dialog__button">{t("common.Common.Cancel")}</button>
                    <button onClick={(e) => { e.preventDefault(); handleLogout(); }} name="cancel" className="lui-button lui-dialog__button">{t("common.Common.Aceptar")}</button>
                </div>
            </Popup>
        </div>
    );
};

export default MzLogout;
