import { zhCN, zhCNplurals } from "./string-zh-rCN.js";
import { en, enPlurals } from "./string-en.js";

export const languages = {
    "zh-CN": {
        name: "zh-CN",
        formattedName: "简体中文",
        resources: zhCN,
        plurals: zhCNplurals
    },
    "en": {
        name: "en",
        formattedName: "English",
        resources: en,
        plurals: enPlurals
    }
}