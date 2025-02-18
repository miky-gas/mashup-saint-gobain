import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const KpiVentas = React.lazy(() => import('@pages/Matriz/_Kpi/kpiMatriz'));
const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));


const VentasAnalisisEvolucionIndicadores = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    {/* <div className="mzh-xxl-20 mzh-xl-20 mzh-lg-40 mzh-md-40 mzh-sm-100 mzh-xs-200 mzh-20 box_object_kpi">
                        <div className="row col-xl-12 col-12 m-0 p-0 mzh-100">
                            <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                                <div className="mz-box-kpi-inner">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'70ab9ad2-0fe7-490d-a3b0-f820a674b18c'} visual="" onObjectLoaded={ObjectLoaded}></GenericQlikObject>
                                </div>
                            </div>
                            <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                                <div className="mz-box-kpi-inner">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'8a128f80-fc6b-490b-aecb-d213d244023c'} visual="" onObjectLoaded={ObjectLoaded}></GenericQlikObject>
                                </div>
                            </div>
                            <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                                <div className="mz-box-kpi-inner">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'STHJJSn'} visual="" onObjectLoaded={ObjectLoaded}></GenericQlikObject>
                                </div>
                            </div>
                            <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                                <div className="mz-box-kpi-inner">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'21422079-e867-46db-afd4-637f5ca97a27'} visual="" onObjectLoaded={ObjectLoaded}></GenericQlikObject>
                                </div>
                            </div>
                            <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                                <div className="mz-box-kpi-inner">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'24d103e3-abac-4a07-bd4b-b72198fef45b'} visual="" onObjectLoaded={ObjectLoaded}></GenericQlikObject>
                                </div>
                            </div>
                            <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                                <div className="mz-box-kpi-inner">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'FppYP'} visual="" onObjectLoaded={ObjectLoaded}></GenericQlikObject>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <KpiVentas aplication={props.aplication} ObjectLoaded={ObjectLoaded}></KpiVentas>
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mzh-xxl-40 mzh-xl-40 mzh-lg-60 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'gJwNgD'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 mzh-xxl-40 mzh-xl-40 mzh-lg-100 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'fJQCjb'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 mzh-xxl-40 mzh-xl-40 mzh-lg-100 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'GGPjg'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 mzh-xxl-40 mzh-xl-40 mzh-lg-100 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'PUPsSg'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 mzh-xxl-40 mzh-xl-40 mzh-lg-100 mzh-md-100 mzh-sm-100 mzh-xs-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'Amvphq'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>
        </React.Fragment>
    );
};
export default VentasAnalisisEvolucionIndicadores;
