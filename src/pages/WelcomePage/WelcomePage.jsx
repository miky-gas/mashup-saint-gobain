import React, { useEffect, Suspense } from "react";
import { UISref } from "@uirouter/react";
import { useTranslation } from "react-i18next";

import { createRoot } from 'react-dom/client';
import MzBlock from "@components/_widgets/MzBlock/MzBlock";
import LanguageSwitcher from "@components/_widgets/LanguageSwitcher/LanguageSwitcher";
import UserProfile from "@components/_features/UserProfile/UserProfile";

const WelcomePage = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const menusClone = document.querySelectorAll('.submenuClone');
    if (menusClone.length > 0) {
      menusClone.forEach((elem) => {
        elem.remove();
      });
    }
    return () => {

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
      root.render(<MzBlock />);
    }
  }
  return (
    <React.Fragment>
      <div className="col-12 mzh-100 m-0 p-0" id="page-content-wrapper-inicio">
        <div className="col-12 mzh-100 m-0 p-0" id="bg-page">
          <div className="col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxl-20 mzh-xl-25 mzh-md-20 mzh-sm-15 mzh-xs-15 mzh-10 m-0" id="header-wellcome">
            <div id="logo-init">
              <img src="./assets/img/logos/Logo-Cliente-001.svg" id="logo_cliente" alt="Logo" />
            </div>
            {/* <div className="box-actions">
              <div className="item-action item-action-user">
                <span className="logged-user"><UserProfile></UserProfile></span>
                <i className="ri-user-line"></i>
              </div>
              <LanguageSwitcher></LanguageSwitcher>
            </div> */}
          </div>
          <div className="col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxl-80 mzh-xl-75 mzh-md-80 mzh-sm-85 mzh-xs-85 mzh-90 m-0" id="content-wellcome">
            <div id="leyend-wwellcome">
              <h1>{t("welcomePage.welcomeMessage")}</h1>
              <p>{t("welcomePage.welcomeLegend")}</p>
            </div>
            <div id="menu-wellcome">
              <div className="menu-container">
                {/* VENTAS */}

                <div title="GAPS" className="item-wellcome-menu" id="item-GAPS">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.GAPS.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-price-tag-2-line"></i>
                        </span>
                        <span className="namee">GAPS</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>

                <div title="RRHH" className="item-wellcome-menu" id="item-RRHH">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.RRHH.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-user-3-line"></i>
                        </span>
                        <span className="namee">RRHH</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>
                <div title="Polivalencia" className="item-wellcome-menu" id="item-Polivalencia">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.Polivalencia.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-swap-3-line"></i>
                        </span>
                        <span className="namee">Polivalencia</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>
                <div title="RealvsEstimado" className="item-wellcome-menu" id="item-RealvsEstimado">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.RealvsEstimado.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-guide-line"></i>
                        </span>
                        <span className="namee">Real vs Estimado</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>

                <div title="Retencion" className="item-wellcome-menu" id="item-Retencion">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.Retencion.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-user-add-line"></i>
                        </span>
                        <span className="namee">Retención</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>
                <div title="Ad-Hoc" className="item-wellcome-menu" id="item-AdHoc">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.AdHoc.Autoservicio">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-tools-line"></i>
                        </span>
                        <span className="namee">Ad Hoc</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>
                <div title="Informes" className="item-wellcome-menu" id="item-Informes">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.Informes.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-file-line"></i>
                        </span>
                        <span className="namee">Informes</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>
                <div title="WCM" className="item-wellcome-menu" id="item-WCM">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.WCM.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <i class="ri-lightbulb-flash-line"></i>
                        </span>
                        <span className="namee">WCM</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>

                <div title={t("menu.Matriz")} className="item-wellcome-menu" id="item-Matriz">
                  <div className="item-content" onClick={() => handleShowBlock()}>
                    <UISref to="home.Matriz.Dashboard">
                      <a className="menu-item" href="javascript:void(0)">
                        <span className="icon-itemmenu">
                        <img src="assets/img/WCM_35W.ico" />
                        </span>
                        <span className="namee">MATRIZ</span>
                      </a>
                    </UISref>
                  </div>
                  <div id="context-menu-container"></div>
                </div>

                {/* Más elementos del menú */}
              </div>
            </div>
          </div>
          <div class="image-wrapper">
            <img src="bg-wellcomel-001.webp" alt="Background Image" class="background-image" loading="lazy" />
          </div>
          <img id="pont-1" src="./assets/img/wellcomeImages/Point-001.png" alt="ImgFondo" />
          <img id="pont-2" src="./assets/img/wellcomeImages/Point-002.png" alt="ImgFondo" />
          <img id="pont-3" src="./assets/img/wellcomeImages/Point-003.png" alt="ImgFondo" />
          <img id="pont-4" src="./assets/img/wellcomeImages/Point-004.png" alt="ImgFondo" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default WelcomePage;
