import * as vueI18n from 'vue-i18n'

declare class VueI18n {
  ts(key: vueI18n.Path, values?: vueI18n.Values): string
}

declare module 'vue/types/vue' {
  interface Vue {
    $ts: typeof VueI18n.prototype.ts
  }
}
