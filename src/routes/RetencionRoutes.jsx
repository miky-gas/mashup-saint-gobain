import React from 'react';
import { renderComponentOnEnter } from './_routes';
import GSenseApp from '@config/configGlobal.jsx';
const GenericView = React.lazy(() => import('@pages/GenericView/GenericView'));
const UiView = React.lazy(() => import('@pages/UiView/UiView'));
const RetencionDashboard = React.lazy(() => import('@pages/Retencion/RetencionDashboard'));
const arrApps = GSenseApp.arrApps;
const INDEXAPLICATION = 0;
export default [
    {
        name: 'home.Retencion',
        component: GenericView,
        abstract: true,
        nodeParent: true,
        label: 'menu.Retencion',
        params: {            
            indexApp: INDEXAPLICATION,
            MENUTOP: 'RetencionMenu',
            isModule: true,
            moduleName: 'Retencion'
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
        name: 'home.Retencion.Dashboard',
        url: '/Retencion',
        component:RetencionDashboard,
        label: 'Dashboard',
        toSheet: true,
        params: {
            idFav: null,
            IDFILTRO: {
                array: true,
                value: [
                    { title: 'Localización', idFiltro: 'c4ff67e1-bf13-44c3-92ef-5e8eeab7a8e1' },
                    { title: 'Periodo', idFiltro: '61a6ec82-47b7-4c50-b0ac-0647164117a8' },
                    { title: 'Datos Usuario', idFiltro: 'e96e6bcc-e546-4ba9-9286-33a0f3cdabeb' },
                ]
            },
            PATH: ['Retención'],
            OBJECTSTOP: {
                arrObject: [
                    {
                        idObject: '63d3977c-6486-46ae-8d2c-4423b39c50e1',
                        widthObjetx: 140
                    }
                ]
            }
        }
    }
];
