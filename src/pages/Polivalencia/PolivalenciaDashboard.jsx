import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));

const PolivalenciaDashboard = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'jmFPsUR'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'Jbcbz'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'akaUKd'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-xs-12 mzh-xl-50 mzh-lg-50 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'fJmamg'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                  
                    
                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>               
        </React.Fragment>
    );
};

export default PolivalenciaDashboard;
