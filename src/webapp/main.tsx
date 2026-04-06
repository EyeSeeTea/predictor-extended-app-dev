import { Provider } from "@dhis2/app-runtime";
import i18n from "../utils/i18n";
import axios from "axios";
import { init } from "d2";
import _ from "lodash";
import ReactDOM from "react-dom";
import { D2Api } from "../types/d2-api";
import App from "./components/app/App";

async function getBaseUrl() {
    if (import.meta.env.DEV) {
        return "/dhis2"; // Dev proxy path (configured in vite.config.ts)
    }

    const { data: manifest } = await axios.get("manifest.webapp");
    return manifest.activities.dhis.href;
}

const isLangRTL = (code: string) => {
    const langs = ["ar", "fa", "ur"];
    const prefixed = langs.map(c => `${c}-`);
    return _(langs).includes(code) || prefixed.filter(c => code && code.startsWith(c)).length > 0;
};

const configI18n = ({ keyUiLocale }: { keyUiLocale: string }) => {
    i18n.changeLanguage(keyUiLocale);
    document.documentElement.setAttribute("dir", isLangRTL(keyUiLocale) ? "rtl" : "ltr");
};

async function main() {
    const baseUrl = await getBaseUrl();
    const rootEl = document.getElementById("root");
    if (!rootEl) throw new Error("Root DOM element not found: id=root");

    try {
        const d2 = await init({ baseUrl: baseUrl + "/api", schemas: [] });
        // Usar backend por defecto (en el skeleton no se fuerza "fetch")
        const api = new D2Api({ baseUrl });
        Object.assign(window, { app: { d2, api } });

        const userSettings = await api.get<{ keyUiLocale: string }>("/userSettings").getData();
        configI18n(userSettings);

        ReactDOM.render(
            <Provider config={{ baseUrl, apiVersion: 30 }}>
                <App api={api} d2={d2} />
            </Provider>,
            rootEl
        );
    } catch (err: any) {
        console.error(err);
        const feedback = err.toString().match("Unable to get schemas") ? (
            <h3 style={{ margin: 20 }}>
                <a rel="noopener noreferrer" target="_blank" href={baseUrl}>
                    Login
                </a>
                {` ${baseUrl}`}
            </h3>
        ) : (
            <h3>{err.toString()}</h3>
        );

        ReactDOM.render(<div>{feedback}</div>, rootEl);
    }
}

main();
