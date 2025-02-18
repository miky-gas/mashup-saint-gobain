import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));

const GAPSDashboard = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    <div className="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'QPuKJqP'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'jvSm'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'PRqqJF'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'SknvkJE'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'Aephjhp'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'UsJJNjj'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'gTmGq'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'DuVFwvG'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                  
                    
                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>               
        </React.Fragment>
    );
};

export default GAPSDashboard;
