import { useMemo } from 'react';
import { format } from 'date-fns';
import { es, enUS, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const useDateFormatter = () => {
  const { i18n } = useTranslation();
  const idioma = i18n.language;

  const locale = useMemo(() => {
    const locales = { es, en: enUS, fr };
    return locales[idioma] || enUS;
  }, [idioma]);

  const getDateFormatted = (date) => {
    if (date) {
      const formatos = {
        es: 'dd-MM-yyyy',
        en: 'MM-dd-yyyy',
        fr: 'dd/MM/yyyy',
      };
      const formato = formatos[idioma] || formatos['es'];
      return format(new Date(date), formato, { locale });
    }
    return '';
  };

  return { getDateFormatted };
};

export default useDateFormatter;
