import React from 'react';
import { renderComponentOnEnter } from './_routes';
import GSenseApp from '@config/configGlobal.jsx';
const GenericView = React.lazy(() => import('@pages/GenericView/GenericView'));
const UiView = React.lazy(() => import('@pages/UiView/UiView'));
const MWCDashboard = React.lazy(() => import('@pages/MWC/MWCDashboard'));
const arrApps = GSenseApp.arrApps;
const INDEXAPLICATION = 0;
export default [
    {
        name: 'home.MWC',
        component: GenericView,
        abstract: true,
        nodeParent: true,
        label: 'menu.MWC',
        params: {            
            indexApp: INDEXAPLICATION,
            MENUTOP: 'MWCMenu',
            isModule: true,
            moduleName: 'MWC'
        },
        resolvePolicy: { async: 'WAIT' },
        resolve: [
            {
                token: 'aplication',
                resolveFn: () => GSenseApp.getDataApp(arrApps[INDEXAPLICATION].idapp).then((res) => res)
            },
            {
                token: 'language',
                deps: ['aplication'],
                resolveFn: (aplication) => {
                    // Verificar si el soporte de multiidioma está activo
                    if (GSenseApp.init.multilanguage) {
                        return GSenseApp.setLanguageToApp(aplication, GSenseApp.init.language);
                    } else {
                        return Promise.resolve(null); // Saltar la resolución del idioma
                    }
                }
            },
            {
                token: 'defaultBookmark',
                deps: ['aplication'],
                resolveFn: (aplication) =>  GSenseApp.getBookmarkId(aplication, INDEXAPLICATION).then((res) => res)
            },
            {
                token: 'setTheme',
                deps: ['defaultBookmark'],
                resolveFn: () =>  GSenseApp.loadTheme().then((res) => res)
            }
        ],
        onExit: renderComponentOnEnter
    },
    {
        name: 'home.MWC.Dashboard',
        url: '/MWC',
        component: MWCDashboard,
        label: 'Dashboard',
        toSheet: true,
        params: {
            idFav: null,
            IDFILTRO: {
                array: true,
                value: [
                    { title: 'Localización', idFiltro: 'WfjJ' },
                    { title: 'Periodo', idFiltro: 'AaxZ' },
                    { title: 'Datos Usuario', idFiltro: 'CPhQDPP' },
                ]
            },
            PATH: ['MWC'],
            OBJECTSTOP: {
                arrObject: [
                    {
                        idObject: 'qYAqf',
                        widthObjetx: 140
                    }
                ]
            }
        }
    }
];
