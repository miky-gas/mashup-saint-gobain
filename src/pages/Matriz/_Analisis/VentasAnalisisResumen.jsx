import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';


const KpiVentas = React.lazy(() => import('@pages/Matriz/_Kpi/kpiMatriz'));
const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));


const VentasAnalisisResumen = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    <KpiVentas aplication={props.aplication} ObjectLoaded={ObjectLoaded}></KpiVentas>
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mzh-xxl-80 mzh-xl-80 mzh-lg-80 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'cef0f80b-0ec9-4ba2-b719-fc079b0e993a'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>
        </React.Fragment>
    );
};
export default VentasAnalisisResumen;
