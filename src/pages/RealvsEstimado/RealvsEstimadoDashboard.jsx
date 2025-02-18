import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));

const RealvsEstimadoDashboard = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'dcd57929-4f0d-41be-b001-6ae3410cd1d1'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'bfa84d62-1b09-47fa-894c-0ee89d0519d8'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'QQYvt'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'utvAcXc'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                  
                    
                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>               
        </React.Fragment>
    );
};

export default RealvsEstimadoDashboard;
