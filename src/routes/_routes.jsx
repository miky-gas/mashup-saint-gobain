import React, { Suspense } from 'react';
import GSenseApp from '@config/configGlobal.jsx';

// Lazy load de los componentes
// const WelcomePage = React.lazy(() => import('@pages/WelcomePage/WelcomePage'));
import WelcomePage from '@pages/WelcomePage/WelcomePage';
const Home = React.lazy(() => import('@pages/Home/Home'));
import MzBlock from "@components/_widgets/MzBlock/MzBlock";

// Importación de rutas
import GAPSRoutes from './GAPSRoutes';
import RRHHRoutes from './RRHHRoutes';
import PolivalenciaRoutes from './PolivalenciaRoutes';
import RealvsEstimadoRoutes from './RealvsEstimadoRoutes';
import RetencionRoutes from './RetencionRoutes';
import AdHocRoutes from './AdHocRoutes';
import InformesRoutes from './InformesRoutes';
import MWCRoutes from './MWCRoutes';
import MatrizRoutes from './MatrizRoutes';

import { createRoot } from 'react-dom/client';

// Cargar arrApps de la configuración
const arrApps = GSenseApp.arrApps;
let arrAppsControl = arrApps;

export function renderComponentOnEnter(transition, stateService) {
  const destinationState = transition.to();
  if (destinationState.name != 'welcome') {
    const menusClone = document.querySelectorAll('.submenuClone');
    if (menusClone.length > 0) {
      menusClone.forEach((elem) => {
        elem.remove();
      });
    }
    let existingDiv = document.getElementById('load_app');
    if (!existingDiv) {
      let div = document.createElement('div');
      div.classList.add('mz-block');
      div.id = 'load_app';
      document.body.prepend(div);
      const root = createRoot(document.getElementById("load_app"));
      root.render(
          <MzBlock />
      );
    }
  }
}

export const STATESROUTES = [
  {
    name: 'welcome',
    url: '/welcome',
    component:  WelcomePage,
    permissions: false,
    label: 'menu.inicio'
  }, 
  {
    name: 'home',
    component: () => (
      <Suspense fallback={<div className='momentum'></div>}>
        <Home />
      </Suspense>
    ),
    abstract: true,
    permissions: false,
  },

  ...GAPSRoutes,
  ...RRHHRoutes,
  ...PolivalenciaRoutes,
  ...RealvsEstimadoRoutes,
  ...RetencionRoutes,
  ...AdHocRoutes,
  ...InformesRoutes,
  ...MWCRoutes,
  ...MatrizRoutes
];

export { arrAppsControl };
