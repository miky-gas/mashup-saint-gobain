import React, { useState, useEffect, useMemo  } from 'react';
import { useTranslation } from "react-i18next";
import GSenseApp from '@config/configGlobal';
import { Tooltip } from 'devextreme-react/tooltip';

function UserProfile() {
    const { t } = useTranslation();
    const[user, setUser] = useState('');
    const tooltipAttributes = useMemo(() => {
        return {
            class: 'mz-tooltip mz-tooltip-right'
        }
    }, []);



    useEffect(() => {
        loadUser();

    }, []);
    const loadUser = async () =>{
        let Qlikproperties = await GSenseApp.getUser();
        var global = Qlikproperties.QS.getGlobal(Qlikproperties.QSCON);
                    
        //Obtener Usuario
        global.getAuthenticatedUser(function(reply) {
            var str = reply.qReturn;
            var isServer = str.includes(';');

            if (isServer == true) {
                str.split(";");
                var usuario = str.split('=');
                setUser(usuario[2]);
            } else {
                setUser(reply.qReturn);
            }
        });
    } 






    return (
        <React.Fragment>
            <div id="user-profile">
                <div id="name-user">{user}</div>
                <div id="name-useer-collapse" data-title={user}>
                <svg class="svg-icon"  width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"/></svg>


                </div>
                <Tooltip
                    wrapperAttr={tooltipAttributes}
                    target="#name-useer-collapse"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                    position="right"
                    hideOnOutsideClick={false}
                >
                   <p>{user}</p>
                </Tooltip>
            </div>
        </React.Fragment>
    );
}

export default UserProfile;
