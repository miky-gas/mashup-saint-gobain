import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));

const VentasKpi = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">

                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object box_mix_object">
                        <div className="box_mix">
                            <div className="box_object_inner_kpi mzh-xl-40 mzh-lg-30 mzh-md-20 mzh-sm-40 mzh-xs-50 mzh-50">
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50 item-inner-kpi">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'70ab9ad2-0fe7-490d-a3b0-f820a674b18c'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'shJPQG'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                            </div>
                            <div className="box_object_inner_grafico mzh-xl-60 mzh-lg-70 mzh-md-80 mzh-sm-60 mzh-xs-50 mzh-50">
                                <GenericQlikObject aplication={props.aplication} qlikObjectID={'EJfTqY'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object box_mix_object">
                        <div className="box_mix">
                            <div className="box_object_inner_kpi mzh-xl-40 mzh-lg-30 mzh-md-20 mzh-sm-40 mzh-xs-50 mzh-50">
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50 item-inner-kpi">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'8a128f80-fc6b-490b-aecb-d213d244023c'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'WGSVjh'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                            </div>
                            <div className="box_object_inner_grafico mzh-xl-60 mzh-lg-70 mzh-md-80 mzh-sm-60 mzh-xs-50 mzh-50">
                                <GenericQlikObject aplication={props.aplication} qlikObjectID={'cqaXJUU'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object box_mix_object">
                        <div className="box_mix">
                            <div className="box_object_inner_kpi mzh-xl-40 mzh-lg-30 mzh-md-20 mzh-sm-40 mzh-xs-50 mzh-50">
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50 item-inner-kpi">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'STHJJSn'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'QuFgE'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                            </div>
                            <div className="box_object_inner_grafico mzh-xl-60 mzh-lg-70 mzh-md-80 mzh-sm-60 mzh-xs-50 mzh-50">
                                <GenericQlikObject aplication={props.aplication} qlikObjectID={'eJWKDs'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object box_mix_object">
                        <div className="box_mix">
                            <div className="box_object_inner_kpi mzh-xl-40 mzh-lg-30 mzh-md-20 mzh-sm-40 mzh-xs-50 mzh-50">
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50 item-inner-kpi">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'21422079-e867-46db-afd4-637f5ca97a27'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'qTpPSN'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                            </div>
                            <div className="box_object_inner_grafico mzh-xl-60 mzh-lg-70 mzh-md-80 mzh-sm-60 mzh-xs-50 mzh-50">
                                <GenericQlikObject aplication={props.aplication} qlikObjectID={'matQd'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object box_mix_object">
                        <div className="box_mix">
                            <div className="box_object_inner_kpi mzh-xl-40 mzh-lg-30 mzh-md-20 mzh-sm-40 mzh-xs-50 mzh-50">
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50 item-inner-kpi">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'24d103e3-abac-4a07-bd4b-b72198fef45b'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'dpMPCW'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                            </div>
                            <div className="box_object_inner_grafico mzh-xl-60 mzh-lg-70 mzh-md-80 mzh-sm-60 mzh-xs-50 mzh-50">
                                <GenericQlikObject aplication={props.aplication} qlikObjectID={'fsNx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object box_mix_object">
                        <div className="box_mix">
                            <div className="box_object_inner_kpi mzh-xl-40 mzh-lg-30 mzh-md-20 mzh-sm-40 mzh-xs-50 mzh-50">
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50 item-inner-kpi">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'FppYP'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-50 mzh-xs-50 mzh-50">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'MEmj'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER} hidespeeldial="true"></GenericQlikObject>
                                </div>
                            </div>
                            <div className="box_object_inner_grafico mzh-xl-60 mzh-lg-70 mzh-md-80 mzh-sm-60 mzh-xs-50 mzh-50">
                                <GenericQlikObject aplication={props.aplication} qlikObjectID={'McAaf'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'CHdXzzF'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'mfnwZz'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mzh-xxl-50 mzh-xl-50 mzh-lg-50 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'wtUQEMP'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>

                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>
        </React.Fragment>
    );
};

export default VentasKpi;
