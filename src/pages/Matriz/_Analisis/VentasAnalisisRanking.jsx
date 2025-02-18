import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const KpiVentas = React.lazy(() => import('@pages/Matriz/_Kpi/kpiMatriz'));
const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));


const VentasAnalisisRanking = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    <KpiVentas aplication={props.aplication} ObjectLoaded={ObjectLoaded}></KpiVentas>
                    <div className="col-xxl-8 col-xl-8 col-lg-6 col-md-12 col-sm-12 col-xs-12 mzh-xxl-80 mzh-xl-80 mzh-lg-80 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'Vjssj'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-xs-12 mzh-xxl-80 mzh-xl-80 mzh-lg-80 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'ApMKA'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                </div>

                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>
        </React.Fragment>
    );
};
export default VentasAnalisisRanking;
