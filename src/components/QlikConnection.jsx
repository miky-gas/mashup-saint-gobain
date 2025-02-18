import { useEffect, useContext } from 'react';
import QlikContext from "@context/QlikContext";
import GSenseApp from '@config/configGlobal.jsx';
function QlikConnection({ onConnection }) {
    const { setQlik, setConnConfig } = useContext(QlikContext);

    useEffect(() => {
        const createConnection = () => {
            var connConfig = {
                host: window.location.hostname,
                prefix: "/",
                port: window.location.port,
                isSecure: window.location.protocol === "https:"
            };
            window.require.config({
                baseUrl: (connConfig.isSecure ? "https://" : "http://") + connConfig.host + (connConfig.port ? ":" + connConfig.port : "") + connConfig.prefix + "resources",
                waitSeconds: 0,
            });

            window.require(["js/qlik"], (qlik) => {
                setQlik(qlik);
                setConnConfig(connConfig);
                GSenseApp.Qlikproperties.QS = qlik;
                GSenseApp.Qlikproperties.QSCON = connConfig;
                if (onConnection) {
                    onConnection({ qlik: qlik });
                }
            });
        };

        createConnection();
    }, [setQlik, setConnConfig, onConnection]); // Asegúrate de incluir todas las dependencias

    // No es necesario devolver nada ya que este componente no tiene representación visual
    return null;
}

export default QlikConnection;
