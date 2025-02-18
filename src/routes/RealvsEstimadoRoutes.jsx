import React from 'react';
import { renderComponentOnEnter } from './_routes';
import GSenseApp from '@config/configGlobal.jsx';
const GenericView = React.lazy(() => import('@pages/GenericView/GenericView'));
const UiView = React.lazy(() => import('@pages/UiView/UiView'));
const RealvsEstimadoDashboard = React.lazy(() => import('@pages/RealvsEstimado/RealvsEstimadoDashboard'));
const arrApps = GSenseApp.arrApps;
const INDEXAPLICATION = 0;
export default [
    {
        name: 'home.RealvsEstimado',
        component: GenericView,
        abstract: true,
        nodeParent: true,
        label: 'menu.RealvsEstimado',
        params: {            
            indexApp: INDEXAPLICATION,
            MENUTOP: 'RealvsEstimadoMenu',
            isModule: true,
            moduleName: 'RealvsEstimado'
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
        name: 'home.RealvsEstimado.Dashboard',
        url: '/Real-vs-Estimado',
        component: RealvsEstimadoDashboard,
        label: 'Dashboard',
        toSheet: true,
        params: {
            idFav: null,
            IDFILTRO: {
                array: true,
                value: [
                    { title: 'Localización', idFiltro: '78ddc41b-cf64-48ff-97b2-ea53616c4637' },
                    { title: 'Periodo', idFiltro: '0d1d8825-674a-4df9-8dd6-97c755ddb9e5' },
                    { title: 'Datos Usuario', idFiltro: 'bb9cd388-e769-4ffb-8ff8-6d1987116ca5' },
                ]
            },
            PATH: ['Real vs Estimado'],
            OBJECTSTOP: {
                arrObject: [
                    {
                        idObject: '2d3d3b2b-e8c3-490e-9481-3f827eb7a6ba',
                        widthObjetx: 140
                    }
                ]
            }
        }
    }
];
