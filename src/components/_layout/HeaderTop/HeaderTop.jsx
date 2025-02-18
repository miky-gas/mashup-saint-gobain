import React, { useEffect, useState, useContext, Suspense } from 'react';
import { UISref, UISrefActive, useRouter } from '@uirouter/react';
import HeaderContext from '@context/HeaderContext';
import { useTranslation } from "react-i18next";
import OptionsHeader from '@components/_layout/OptionsHeader/OptionsHeader';
import GSenseApp from '@config/configGlobal.jsx';
import { useSelector, useDispatch } from 'react-redux';
import store, { toggleSidebar } from '@store/store'; // Importa tu store Redux

const LanguageSwitcher = React.lazy(() => import('@components/_widgets/LanguageSwitcher/LanguageSwitcher'));

function HeaderTop(props) {
    const ROUTER = useRouter();
    const { t } = useTranslation();
    const { sidebarCollapsed, setSidebarCollapsed } = useContext(HeaderContext);
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const dispatch = useDispatch();


    useEffect(() => {
        // Lógica que se ejecuta al montar el componente
        generateBreadcrumb(ROUTER.globals.params.PATH);
        // Suscripción al evento onSuccess para regenerar el breadcrumb cuando cambie la ruta
        const onSuccessListener = ROUTER.transitionService.onSuccess({}, () => {
            if (ROUTER.globals.params) {
                generateBreadcrumb(ROUTER.globals.params.PATH);
            }
        });
        return () => {
            // Lógica que se ejecuta al desmontar el componente
            onSuccessListener();
        };
    }, []); // El segundo argumento del useEffect es un array vacío para asegurar que el efecto solo se ejecute una vez al montar el componente

    const generateBreadcrumb = (path) => {
        if (path) {
            const items = path.filter(Boolean);
            setBreadcrumbItems(items);
        }
    }
    const handleToogleSidebar = () => {
        dispatch(toggleSidebar());
        setSidebarCollapsed(prevSidebarCollapsed => !prevSidebarCollapsed)
        document.body.classList.toggle('sidebar-collapsed');
        const menusClone = document.querySelectorAll('.submenuClone');
        if (menusClone.length > 0) {
            menusClone.forEach((elem) => {
                elem.remove();
            });
        }
        setTimeout(() => {
            GSenseApp.Qlikproperties.QS.resize();
        }, 300);
    }
    const handleToogleMenu = () => {
        document.body.classList.toggle('sidebar-collapsed-responsive');
    }
    return (
        <React.Fragment>
                <header id="top-header">
                    <div class="mz-list-options" id="item-left">
                        <div class="item-option ico-menu-collapse">
                            <a id="btn-collapse-sidebar" href="javascript:void(0)" onClick={handleToogleSidebar}>
                                <i class="ri-menu-fill"></i>
                            </a>
                        </div>

                        <div class="item-option ico-menu-hide">
                            <a id="btn-collapse-sidebar" href="javascript:void(0)" onClick={handleToogleMenu}>
                                <i class="ri-menu-fill"></i>
                            </a>
                        </div>
                    </div>
                    <ul className="mz-breadcrumb">
                        {breadcrumbItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {index !== 0 && (
                                    <li className="mz-breadcrumb-item mz-breadcrumb-item-arrow" key={`arrow-${index}`}>
                                        <i className="ri-arrow-right-s-line"></i> {/* Ícono de Remixicon */}
                                    </li>
                                )}
                                <li className="mz-breadcrumb-item" key={`item-${index}`}>
                                    {t(item)}
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                    <div id="header-options">
                        <OptionsHeader properties={props.properties} />
                    </div>
                    <LanguageSwitcher />
                    {/* <div id="logo-app">
                        <img src="assets/img/logos/logo-app-003.svg" alt="Logo" />
                    </div> */}
                </header>
        </React.Fragment>
    );
}

export default HeaderTop;
