declare global {
  interface Window {
    timeoutFlag: boolean;
    APIHOST: string;
  }
}

import { MessageBox } from "element-ui";
function checkTimeout(i18n: any, router: any, data: any): void {
  if (data.result === "0xff") {
    if (!window.timeoutFlag) {
      window.timeoutFlag = true;
      MessageBox.alert(i18n.t("header.timeoutMessage"), {
        type: "warning",
        callback: () => {
          window.timeoutFlag = false;
          router.push("/");
        }
      });
    }
  }
}

function correctUrl(url: string) {
  return url.startsWith("http") || url.startsWith("/")
    ? url
    : window.APIHOST + url;
}

function formEncode(data: any) {
  let body = "";
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      body += `${key}=${data[key]}&`;
    }
  }
  return body.slice(0, -1);
}
export default class FetchUtil {
  public get: (url: any) => Promise<any>;
  public postJSON: (url: any, data: any) => Promise<any>;
  public postForm: (url: any, data: any) => Promise<any>;
  constructor(i18n: any, router: any) {
    this.get = url => {
      const correctedUrl = correctUrl(url);
      return fetch(correctedUrl, { credentials: "include" })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("get error: " + url);
          }
        })
        .then(data => {
          checkTimeout(i18n, router, data);
          return data;
        });
    };
    this.postJSON = (url, data) => {
      const correctedUrl = correctUrl(url);
      return fetch(correctedUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json;charset=utf-8" },
        credentials: "include"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("post error: " + correctedUrl);
          }
        })
        .then(resData => {
          checkTimeout(i18n, router, resData);
          return data;
        });
    };
    this.postForm = (url, data) => {
      const correctedUrl = correctUrl(url);
      return fetch(correctedUrl, {
        method: "POST",
        body: formEncode(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        credentials: "include"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("post error: " + correctedUrl);
          }
        })
        .then(resData => {
          checkTimeout(i18n, router, resData);
          return data;
        });
    };
  }
}
