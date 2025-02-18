import React, { Suspense, lazy } from 'react';

// Mapa de componentes con importaciones dinámicas
const componentMap = {
  'GAPSMenu': lazy(() => import('@pages/GAPS/__Menus/GAPSMenu')),
  'RRHHMenu': lazy(() => import('@pages/RRHH/__Menus/RRHHMenu')),
  'PolivalenciaMenu': lazy(() => import('@pages/Polivalencia/__Menus/PolivalenciaMenu')),
  'RealvsEstimadoMenu': lazy(() => import('@pages/RealvsEstimado/__Menus/RealvsEstimadoMenu')),
  'RetencionMenu': lazy(() => import('@pages/Retencion/__Menus/RetencionMenu')),
  'AdHocMenu': lazy(() => import('@pages/Adhoc/__Menus/AdhocMenu')),
  'InformesMenu': lazy(() => import('@pages/Informes/__Menus/InformesMenu')),
  'MWCMenu': lazy(() => import('@pages/MWC/__Menus/MWCMenu')),
  'MatrizMenu': lazy(() => import('@pages/Matriz/__Menus/MatrizMenu')),

  // Agrega más componentes según sea necesario
};

function DynamicComponentLoader({ componentName }) {
  if(componentName == null){
    return null
  }
  const Component = componentMap[componentName];

  if (!Component) {
    console.error(`Error: No se encontró el componente ${componentName}`);
    return null;
  }

  return (
      <Component />
  );
}

export default DynamicComponentLoader;
