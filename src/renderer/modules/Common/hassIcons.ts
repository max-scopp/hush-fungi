import * as mdiIcons from "@mdi/js";
import * as changeCase from "change-case";

export const hassIcons = new Proxy({} as { [key: string]: string }, {
  get(_target, key: undefined | string) {
    if (!key || key === "undefined") {
      return "";
    }

    const namespace = key.match(/^[^:]+/i);
    const fullKebabName = key.replace(":", "-");

    if (namespace) {
      switch (namespace[0]) {
        case "mdi": {
          const camelCaseName = changeCase.camelCase(fullKebabName);
          return (mdiIcons as any)[camelCaseName] || "";
        }
      }
    }
  },
});
