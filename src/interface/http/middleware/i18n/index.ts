import path from "path";
import { I18n } from "i18n";
import { Logger } from "@util/logger";
import { getAgent } from "@util/apm";
import {env} from "@util/env";

const i18n = new I18n({
    locales: [
        "pt-BR",
        "en-US",
    ],
    fallbacks: {
        pt: "pt-BR",
        en: "en-US",
    },
    defaultLocale: "pt-BR",
    directory: path.join(__dirname, "locales"),
    directoryPermissions: "755",
    register: global,
    autoReload: env.get().enviorement !== "test",
    extension: ".json",
    queryParameter: "lang",
    header: "accept-language",
    logErrorFn: (msg)=>{
        if(getAgent() && getAgent().isStarted()){
            getAgent().captureError(msg);
        }
        Logger.error(msg);
    }
});

export default i18n;