import React, { Suspense, useEffect, useState } from 'react';
import { UIView } from '@uirouter/react';
import { HeaderProvider } from "@context/HeaderContext.jsx";
const MainMenu = React.lazy(() => import('@components/_layout/MainMenu/MainMenu'));
const HeaderTop = React.lazy(() => import('@components/_layout/HeaderTop/HeaderTop'));
function Home(props) {


  return (
    <React.Fragment>
        <HeaderProvider>
          <div className="mashup-body col-12 mzh-100 m-0 p-0">
            <MainMenu properties={props}></MainMenu>
            <div className="main-content">
              <HeaderTop properties={props}></HeaderTop>
              <UIView />
            </div>
          </div>
        </HeaderProvider>
    </React.Fragment>
  );
}

export default Home;
