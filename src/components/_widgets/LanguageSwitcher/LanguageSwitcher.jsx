import React, { useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import GSenseApp from '@config/configGlobal.jsx';
import QlikContext from '@context/QlikContext';
import DropDownButton from 'devextreme-react/cjs/drop-down-button';

function LanguageSwitcher() {
  const { qlik, currentApp } = useContext(QlikContext);
  const { multilanguage, language, listLanguages, varLanguage, fieldLanguage } = GSenseApp.init;
  const { t, i18n } = useTranslation();
  const [langs, setLangs] = useState([]);

  useEffect(() => {
    const listIdiomas = listLanguages;
    const idioma = i18n.language || language;

    const newLangs = listIdiomas.map(value => ({
      lang: t(`label.${value}`),
      langKey: value,
      active: idioma === value,
    }));

    setLangs(newLangs);
  }, [t, i18n.language, language, listLanguages]);

  const handleCambiaIdioma = (language) => {
    i18next.changeLanguage(language);
    qlik.setLanguage(language);

    setLangs(langs.map(lang => ({ ...lang, active: lang.langKey === language })));
    GSenseApp.init.language = language;

    if (currentApp) {
      currentApp.variable.setStringValue(varLanguage, language).catch(() => {
        currentApp.field(fieldLanguage).getData().then(function (FieldLanguage) {
          const cambioIdioma = async function () {
            switch (FieldLanguage.rows.length) {
              case 0:
                return false;
              default:
                currentApp.field(fieldLanguage).clear().then(function () {
                  currentApp.field(fieldLanguage).selectValues([language.toUpperCase()], false, true);
                });
                break;
            }
            FieldLanguage.OnData.unbind(cambioIdioma);
          };
          FieldLanguage.OnData.bind(cambioIdioma);
        }).catch(function (error) {
          console.error("Error al obtener datos del campo:", error);
        });
      }).catch(function (error) {
        console.error("Error al establecer el valor de la variable:", error);
      });
    }
  };

  return (
    <React.Fragment>
      {multilanguage && (
        <div className="LanguageSwitcher">
          <DropDownButton     
            items={langs}
            displayExpr="lang"
            keyExpr="langKey"            
            onItemClick={(e) => handleCambiaIdioma(e.itemData.langKey)}
            selectedItemKey={langs.find(lang => lang.active)?.langKey}
            text={langs.find(lang => lang.active)?.lang.toUpperCase()}
            itemRender={(itemData) => (
              <div style={{ fontWeight: itemData.active ? 'bold' : 'normal' }}>
                {itemData.lang.toUpperCase()}
              </div>
            )}
            activeStateEnabled={false}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default LanguageSwitcher;
