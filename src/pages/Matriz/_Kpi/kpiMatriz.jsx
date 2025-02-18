import React, { useEffect, Suspense } from 'react';
import { useRouter } from "@uirouter/react";
const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const KpiMatriz = ({ aplication, ObjectLoaded }) => {
    const ROUTER = useRouter();
    useEffect(() => {
        ObjectLoaded();
    }, []);

    return (
        <React.Fragment>
                <div className="mzh-xxl-20 mzh-xl-20 mzh-lg-40 mzh-md-40 mzh-sm-100 mzh-xs-200 mzh-20 box_object_kpi">
                    <div className="row col-xl-12 col-12 m-0 p-0 mzh-100">
                        <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                            <div className="mz-box-kpi-inner">
                                <GenericQlikObject aplication={aplication} qlikObjectID={'xxx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                        <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                            <div className="mz-box-kpi-inner">
                                <GenericQlikObject aplication={aplication} qlikObjectID={'xxx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                        <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                            <div className="mz-box-kpi-inner">
                                <GenericQlikObject aplication={aplication} qlikObjectID={'xxx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                        <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                            <div className="mz-box-kpi-inner">
                                <GenericQlikObject aplication={aplication} qlikObjectID={'xxx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                        <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                            <div className="mz-box-kpi-inner">
                                <GenericQlikObject aplication={aplication} qlikObjectID={'xxx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                        <div className="mz-box-kpi col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mzh-xl-100 mzh-lg-50 mzh-md-50 mzh-sm-33 mzh-xs-16">
                            <div className="mz-box-kpi-inner">
                                <GenericQlikObject aplication={aplication} qlikObjectID={'xxx'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                            </div>
                        </div>
                    </div>
                </div>
        </React.Fragment>
    );
};

export default KpiMatriz;
