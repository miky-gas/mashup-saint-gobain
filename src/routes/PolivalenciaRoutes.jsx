import React from 'react';
import { renderComponentOnEnter } from './_routes';
import GSenseApp from '@config/configGlobal.jsx';
const GenericView = React.lazy(() => import('@pages/GenericView/GenericView'));
const UiView = React.lazy(() => import('@pages/UiView/UiView'));
const PolivalenciaDashboard = React.lazy(() => import('@pages/Polivalencia/PolivalenciaDashboard'));
const arrApps = GSenseApp.arrApps;
const INDEXAPLICATION = 0;
export default [
    {
        name: 'home.Polivalencia',
        component: GenericView,
        abstract: true,
        nodeParent: true,
        label: 'menu.Polivalencia',
        params: {            
            indexApp: INDEXAPLICATION,
            MENUTOP: 'PolivalenciaMenu',
            isModule: true,
            moduleName: 'Polivalencia'
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
        name: 'home.Polivalencia.Dashboard',
        url: '/Polivalencia',
        component: PolivalenciaDashboard,
        label: 'Dashboard',
        toSheet: true,
        params: {
            idFav: null,
            IDFILTRO: {
                array: true,
                value: [
                    { title: 'Localización', idFiltro: 'DpqwgDP' },
                    { title: 'Periodo', idFiltro: 'JjEdmXa' },
                    { title: 'Datos Usuario', idFiltro: 'YyNzbpJ' },
                ]
            },
            PATH: ['Polivalencia'],
            OBJECTSTOP: {
                arrObject: [
                    {
                        idObject: 'bqrXJtL',
                        widthObjetx: 140
                    }
                ]
            }
        }
    }
];
