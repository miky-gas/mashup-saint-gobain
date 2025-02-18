import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const KpiVentas = React.lazy(() => import('@pages/Matriz/_Kpi/kpiMatriz'));
const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));


const VentasAnalisisDistribucion = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    <KpiVentas aplication={props.aplication} ObjectLoaded={ObjectLoaded}></KpiVentas>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 mzh-xxl-80 mzh-xl-80 mzh-lg-80 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'xQyuXM'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 mzh-xxl-80 mzh-xl-80 mzh-lg-80 mzh-md-100 mzh-sm-100 mzh-xs-100 m-0 p-0">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-50 mzh-xs-100 box_object">
                            <GenericQlikObject aplication={props.aplication} qlikObjectID={'RfHPGLD'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                        </div>
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-50 mzh-xs-100 box_object">
                            <GenericQlikObject aplication={props.aplication} qlikObjectID={'kPUtt'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                        </div>
                    </div>
                </div>
                <FiltersComponent aplication={props.aplication} key={props.$stateParams.IDFILTRO} qlikObjectID={props.$stateParams.IDFILTRO}></FiltersComponent>
        </React.Fragment>
    );
};
export default VentasAnalisisDistribucion;
