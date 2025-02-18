import React from 'react';
import { renderComponentOnEnter } from './_routes';
import GSenseApp from '@config/configGlobal.jsx';
const GenericView = React.lazy(() => import('@pages/GenericView/GenericView'));
const UiView = React.lazy(() => import('@pages/UiView/UiView'));
const AdHocAutoservicio = React.lazy(() => import('@pages/AdHoc/AdHocAutoservicio'));
const arrApps = GSenseApp.arrApps;
const INDEXAPLICATION = 0;
export default [
    {
        name: 'home.AdHoc',
        component: GenericView,
        abstract: true,
        nodeParent: true,
        label: 'menu.AdHoc',
        params: {            
            indexApp: INDEXAPLICATION,
            MENUTOP: 'AdHocMenu',
            isModule: true,
            moduleName: 'AdHoc'
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
        name: 'home.AdHoc.Autoservicio',
        url: '/Ad-Hoc',
        component: AdHocAutoservicio,
        label: 'Autoservicio',
        toSheet: true,
        params: {
            idFav: null,
            IDFILTRO: {
                array: true,
                value: [
                    { title: 'Localización', idFiltro: 'hjsfpF' },
                    { title: 'Periodo', idFiltro: 'PCNyx' },
                    { title: 'Datos Usuario', idFiltro: 'LtJzLE' },
                ]
            },
            PATH: ['Ad Hoc'],
            OBJECTSTOP: {
                arrObject: [
                    {
                        idObject: 'amPdPh',
                        widthObjetx: 140
                    }
                ]
            }
        }
    }
];
