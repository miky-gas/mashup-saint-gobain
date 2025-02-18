import React, { useEffect, useContext, Suspense, useState } from 'react';
import QlikContext from "@context/QlikContext";
import { UIView } from '@uirouter/react';

const CurrentSelectionsObject = React.lazy(() => import('@components/_features/CurrentSelectionsObject/CurrentSelectionsObject'));
const DynamicComponentLoader = React.lazy(() => import('@components/_features/DynamicComponentLoader/DynamicComponentLoader'));
const BookmarkComponent = React.lazy(() => import('@components/_features/BookmarkComponent/BookmarkComponent'));
const GlossaryComponent = React.lazy(() => import('@components/_features/GlossaryComponent/GlossaryComponent'));

const GenericView = (props) => {
    const { qlik, connConfig, currentApp, setCurrentApp } = useContext(QlikContext);
    const [APLICATION] = useState(props.aplication || props.$stateParams.aplication);
    const [HIDESELECTIONBAR] = useState(props.$stateParams.HIDESELECTIONBAR || false);
    useEffect(() => {
        setCurrentApp(APLICATION);
    }, []);

    return (
        <React.Fragment>
                <div className="mashup-body-object">
                    <DynamicComponentLoader componentName={props.$stateParams.MENUTOP} />
                    {!HIDESELECTIONBAR && (
                        <CurrentSelectionsObject aplication={APLICATION} qlikObjectID={'CurrentSelections'} properties={props}></CurrentSelectionsObject>
                    )}
                    
                    <UIView />
                    <BookmarkComponent aplication={APLICATION}></BookmarkComponent>
                    <GlossaryComponent aplication={APLICATION}></GlossaryComponent>
                </div>
        </React.Fragment>

    )
};

export default GenericView;
