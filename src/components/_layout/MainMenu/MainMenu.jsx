{/* <MyButton
  onClick={()=>this.props.transition.router.stateService.go('.new')}
>create new</MyButton> */}
import React, { useEffect, useContext, useState, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { useRouter } from "@uirouter/react";
import { UISref, UISrefActive } from "@uirouter/react";
import { useTranslation } from "react-i18next";
import HeaderContext from '@context/HeaderContext';
import { useSelector } from 'react-redux';
import GSenseApp from '@config/configGlobal.jsx';

import MzBlock from "@components/_widgets/MzBlock/MzBlock";
const VentasMenu = React.lazy(() => import('@pages/Matriz/__Menus/MatrizMenu'))
const GAPSMenu = React.lazy(() => import('@pages/GAPS/__Menus/GAPSMenu'))
const RRHHMenu = React.lazy(() => import('@pages/RRHH/__Menus/RRHHMenu'))
const PolivalenciaMenu = React.lazy(() => import('@pages/RRHH/__Menus/RRHHMenu'))
const RealvsEstimadoMenu = React.lazy(() => import('@pages/RealvsEstimado/__Menus/RealvsEstimadoMenu'))
const PersonasRetenidasMenu = React.lazy(() => import('@pages/Retencion/__Menus/RetencionMenu'))
const BookmarkActive = React.lazy(() => import('@components/_features/BookmarkActive/BookmarkActive'));
const UserProfile = React.lazy(() => import('@components/_features/UserProfile/UserProfile'));
const FooterInfo = React.lazy(() => import('@components/_features/FooterInfo/FooterInfo'));



function MainMenu() {
    const { t } = useTranslation();
    const { sidebarCollapsed } = useContext(HeaderContext);

    const router = useRouter();
    const [parent, setParent] = useState(router.globals.$current.parent.name);
    const sidebarActivo = useSelector(state => state.Sidebar.activo);
    // const states = router.stateService.get().filter(state => !state.hideSegment).filter(state => state.label);
    useEffect(() => {
        const unregister = router.transitionService.onSuccess({}, () => {
            setParent(router.globals.$current.parent.name);
        });

        return unregister;
    }, [router]);

    useEffect(() => {
        // Función que cierra el menu responsive si hay resize
        const handleResize = () => {
            document.body.classList.remove('sidebar-collapsed-responsive');
        };
    
        // Añade el listener para el evento resize
        window.addEventListener('resize', handleResize);
    
        // Limpia el listener cuando el componente se desmonta
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); 

    const handleShowBlock = () => {
        let existingDiv = document.getElementById('load_app');
        if (!existingDiv) {
            let div = document.createElement('div');
            div.classList.add('mz-block');
            div.id = 'load_app';
            document.body.prepend(div);
            const root = createRoot(document.getElementById("load_app"));
            root.render(<Suspense fallback={<div className='momentum transparent'></div>}><MzBlock></MzBlock></Suspense>);
        }
    }

    const handleToogleMenu = () => {
        document.body.classList.toggle('sidebar-collapsed-responsive');
    }

    const destroyCloneMenu = () => {
        const menusClone = document.querySelectorAll('.submenuClone');
        if (menusClone.length > 0) {
            menusClone.forEach((elem) => {
                elem.remove();
            });
        }
    };
    return (
        <React.Fragment>
                <div onMouseEnter={destroyCloneMenu} className={`mainMenu ${sidebarActivo == true ? 'sidebar-collapse' : 'sidebar-expand'}`}>
                    <div className="sidebar-wrapper" id="sidebar-wrapper">
                        <div class="item-option ico-menu-collapse">
                            <a id="btn-collapse-sidebar" href="javascript:void(0)" onClick={handleToogleMenu}>
                                <i class="ri-close-large-line"></i>
                            </a>
                        </div>
                        <div id="logo-cliente">
                            {sidebarCollapsed ? (
                                <img src="assets/img/logos/Logo-Cliente-001.svg" className="logo-xs ng-scope" alt="logo" />
                            ) : (
                                <img src="assets/img/logos/Logo-Cliente-001.svg" className="logo-xl ng-scope" alt="logo" />
                            )}

                        </div>
                        <ul className="list-nav">

                            <UISrefActive class="active-item">
                                <li>
                                    <UISref to="welcome">
                                        <a href="javascript:void(0)" className="menu-item">
                                            <i className="ri-home-line"></i>
                                            <p className='menu-item-text'>{t("menu.inicio")}</p>
                                        </a>
                                    </UISref>
                                </li>
                            </UISrefActive>
                            <li onClick={() => !parent.includes('home.GAPS') && handleShowBlock()} className={parent.includes('home.GAPS') ? 'active-item' : ''}>
                                <UISref to="home.GAPS.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-price-tag-2-line"></i>
                                        <p className='menu-item-text'>GAPS</p>
                                    </a>
                                </UISref>
                            </li>

                            <li onClick={() => !parent.includes('home.RRHH') && handleShowBlock()} className={parent.includes('home.RRHH') ? 'active-item' : ''}>
                                <UISref to="home.RRHH.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-user-3-line"></i>
                                        <p className='menu-item-text'>RRHH</p>
                                    </a>
                                </UISref>
                            </li>
                            <li onClick={() => !parent.includes('home.Polivalencia') && handleShowBlock()} className={parent.includes('home.Polivalencia') ? 'active-item' : ''}>
                                <UISref to="home.Polivalencia.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-swap-3-line"></i>
                                        <p className='menu-item-text'>Polivalencia</p>
                                    </a>
                                </UISref>
                            </li>
                            <li onClick={() => !parent.includes('home.RealvsEstimado') && handleShowBlock()} className={parent.includes('home.RealvsEstimado') ? 'active-item' : ''}>
                                <UISref to="home.RealvsEstimado.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-guide-line"></i>
                                        <p className='menu-item-text'>Real vs Estimado</p>
                                    </a>
                                </UISref>
                            </li>
                            <li onClick={() => !parent.includes('home.Retencion') && handleShowBlock()} className={parent.includes('home.Retencion') ? 'active-item' : ''}>
                                <UISref to="home.Retencion.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-user-add-line"></i>
                                        <p className='menu-item-text'>Retención</p>
                                    </a>
                                </UISref>
                            </li>

                            <li onClick={() => !parent.includes('home.AdHoc') && handleShowBlock()} className={parent.includes('home.AdHoc') ? 'active-item' : ''}>
                                <UISref to="home.AdHoc.Autoservicio">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-tools-line"></i>
                                        <p className='menu-item-text'>Ad Hoc</p>
                                    </a>
                                </UISref>
                            </li>
                            <li onClick={() => !parent.includes('home.Informes') && handleShowBlock()} className={parent.includes('home.Informes') ? 'active-item' : ''}>
                                <UISref to="home.Informes.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-file-line"></i>
                                        <p className='menu-item-text'>Informes</p>
                                    </a>
                                </UISref>
                            </li>
                            <li onClick={() => !parent.includes('home.WCM') && handleShowBlock()} className={parent.includes('home.WCM') ? 'active-item' : ''}>
                                <UISref to="home.WCM.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item">
                                    <i class="ri-lightbulb-flash-line"></i>
                                        <p className='menu-item-text'>WCM</p>
                                    </a>
                                </UISref>
                            </li>



                            <li onClick={() => !parent.includes('home.Matriz') && handleShowBlock()} className={parent.includes('home.Matriz') ? 'active-item' : ''}>
                                <UISref to="home.Matriz.Dashboard">
                                    <a href="javascript:void(0)" className="menu-item matriz_a">
                                    <img src="assets/img/WCM_24.ico" />
                                        <p className='menu-item-text matriz_p'>MATRIZ</p>
                                    </a>
                                </UISref>
                            </li>
                        </ul>

                        <div className='cover-footer-menu' id="pastilla-footer">
                            <BookmarkActive></BookmarkActive>
                            <UserProfile></UserProfile>
                            <FooterInfo></FooterInfo>
                        </div>

                    </div>
                </div>


        </React.Fragment>
    );
};

export default MainMenu;
