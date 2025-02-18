import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { incrementPartials, setTotal } from '@store/store';
import { useRouter } from "@uirouter/react";

const useQlikObjectsLoader = () => {
    const ROUTER = useRouter();
    const dispatch = useDispatch();
    const [loadedComponentsAll, setLoadedComponentsAll] = useState(false);
    const [partialObjectLoaded, setPartialObjectLoaded] = useState(0);
    const numChildrenRef = useRef(0);

    const ObjectLoaded = () => {
        setPartialObjectLoaded(prevPartialObjectLoaded => {
            dispatch(incrementPartials());
            return prevPartialObjectLoaded + 1;
        });
    };

    useEffect(() => {
        if (partialObjectLoaded) {
            const scrollableView = document.getElementById('scrollable-view');
            const numGenericQlikObjects = scrollableView.querySelectorAll('.qlik-embed').length;

            // Set the total number of Qlik objects once
            if (numChildrenRef.current === 0 && numGenericQlikObjects > 0) {
                numChildrenRef.current = numGenericQlikObjects;
                dispatch(setTotal(numGenericQlikObjects));
            }

            if (partialObjectLoaded >= numChildrenRef.current) {
                setLoadedComponentsAll(true);
                const el = document.getElementById('load_app');
                if (el) {
                    el.parentNode.removeChild(el);
                }
            }
        }
    }, [partialObjectLoaded, dispatch]);

    return {
        loadedComponentsAll,
        ObjectLoaded,
        partialObjectLoaded,
        ROUTER
    };
};

export default useQlikObjectsLoader;
