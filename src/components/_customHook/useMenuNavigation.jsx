import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@uirouter/react';

export const useMenuNavigation = (props) => {
    const ROUTER = useRouter();
    const [mouseaction] = useState(props.mouseaction || true);
    const [paramsRoute, setParamsRoute] = useState();
    const [objectTop, setObjectTop] = useState(false);
    const [arrObject, setArrObject] = useState([]);
    const menuRef = useRef(null);
    const listaMenuContenidosRef = useRef(null);
    const objectTopRef = useRef(null);
    const [scrollButtonsState, setScrollButtonsState] = useState({ left: false, right: false });

    // Verifica la visibilidad de los botones de scroll
    const checkScrollButtonsVisibility = () => {
        const container = listaMenuContenidosRef.current;
        if (container) {
            const containerWidth = container.offsetWidth;
            const contentWidth = container.scrollWidth;
            const scrollLeft = container.scrollLeft;
            const scrollRight = contentWidth - (scrollLeft + containerWidth);

            setScrollButtonsState({
                left: scrollLeft > 0,
                right: scrollRight > 0
            });
        }
    };

    const scrollMenu = (direction) => {
        destroyCloneMenu();
        const container = listaMenuContenidosRef.current;
        if (container) {
            const itemWidth = container.querySelector('li')?.offsetWidth || 0;
            const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        checkScrollButtonsVisibility();

        const handleResize = () => {
            checkScrollButtonsVisibility();
        };

        const container = listaMenuContenidosRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtonsVisibility);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container) {
                container.removeEventListener('scroll', checkScrollButtonsVisibility);
            }
        };
    }, [arrObject]);

    useEffect(() => {
        const params = ROUTER.globals.params;
        const objectTopRouter = params?.OBJECTSTOP?.arrObject || [];
        setParamsRoute(params);
        setObjectTop(!!params?.OBJECTSTOP);
        setArrObject(objectTopRouter);

        const onSuccessCallback = (transition) => {
            const params = ROUTER.globals.params;
            const objectTopRouter = params?.OBJECTSTOP?.arrObject || [];
            setParamsRoute(params);
            setObjectTop(!!params?.OBJECTSTOP);
            setArrObject(objectTopRouter);
        };

        const deregister = ROUTER.transitionService.onSuccess({}, onSuccessCallback);

        return () => {
            deregister();
        };
    }, [ROUTER]);

    useEffect(() => {
        const handleMouseOver = (event) => {
            const { id } = event.target;
            if (id === 'top-header' || id === 'box-current-selecctions' || id === 'page-container') {
                destroyCloneMenu();
            }
        };

        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            destroyCloneMenu();
        };
    }, []);

    const handleMouseEnter = (event) => {
        if (mouseaction) {
            event.preventDefault();
            const el = event.currentTarget;
            destroyCloneMenu();
            const parent = el.closest('#sidebar-wrapper');
            const subMenu = el.querySelector('.subMenuVistas');
            if (subMenu && !parent) {
                const rect = el.getBoundingClientRect();
                const menuClone = subMenu.innerHTML;
                const menuPosition = {
                    left: rect.left - 1,
                    top: rect.bottom - 3,
                };

                const _html = `<ul class="subMenuVistas submenuClone" style="left:${menuPosition.left}px; top:${menuPosition.top}px">${menuClone}</ul>`;
                document.body.insertAdjacentHTML('beforeend', _html);
                document.querySelector('.submenuClone').addEventListener('mouseleave', destroyCloneMenu);
            }
        }
    };

    const destroyCloneMenu = () => {
        const menusClone = document.querySelectorAll('.submenuClone');
        if (menusClone.length > 0) {
            menusClone.forEach((elem) => elem.remove());
        }
    };

    return {
        scrollMenu,
        handleMouseEnter,
        destroyCloneMenu,
        listaMenuContenidosRef,
        menuRef,
        objectTopRef,
        objectTop,
        arrObject,
        paramsRoute,
        scrollButtonsState,
    };
};
