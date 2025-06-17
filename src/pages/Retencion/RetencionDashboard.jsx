import React, { Suspense } from 'react';
import useQlikObjectsLoader from '@hooks/useQlikObjectsLoader';

const GenericQlikObject = React.lazy(() => import('@components/GenericQlikObject/GenericQlikObject'));
const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));

const RetencionDashboard = (props) => {
    const { loadedComponentsAll, ObjectLoaded, partialObjectLoaded, ROUTER } = useQlikObjectsLoader();

    return (
        <React.Fragment>
                <div className="flex-component" id="scrollable-view">
                  
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-50 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'Pjjse'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                    
                    <div className=" flex-component flex-row col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object" >
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-4 col-xs-4 mzh-xl-70 mzh-lg-70 mzh-md-70 mzh-sm-70 mzh-xs-70 mzh-70 box_object">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'fAZQJz'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                        </div>

                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-4 col-xs-4 mzh-xl-30 mzh-lg-30 mzh-md-30 mzh-sm-30 mzh-xs-30 mzh-30 box_object">
                                    <GenericQlikObject aplication={props.aplication} qlikObjectID={'JFALTK'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mzh-xl-100 mzh-lg-100 mzh-md-100 mzh-sm-100 mzh-xs-100 mzh-100 box_object">
                        <GenericQlikObject aplication={props.aplication} qlikObjectID={'YqzWQq'} visual="" onObjectLoaded={ObjectLoaded} location={ROUTER.globals.current.name} router={ROUTER}></GenericQlikObject>
                    </div>
                  
                </div>
                <FiltersComponent aplication={props.aplication} qlikObjectID={props.$stateParams.IDFILTRO} ObjectLoaded={ObjectLoaded}></FiltersComponent>               
        </React.Fragment>
    );
};

export default RetencionDashboard;
