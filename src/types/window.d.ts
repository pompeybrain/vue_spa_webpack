import VueI18n from "vue-i18n";

import { IVueI18n } from "vue-i18n";

type ReturnString = {
  (key: VueI18n.Path, values?: VueI18n.Values): string;
};

declare module "vue/types/vue" {
  interface Vue {
    readonly $i18n: VueI18n & IVueI18n;
    $ts: ReturnString;
  }
}