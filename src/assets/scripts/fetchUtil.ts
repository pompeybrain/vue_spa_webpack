declare global {
  interface Window {
    timeoutFlag: boolean;
    APIHOST: string;
  }
}
import vueI18n from 'vue-i18n';
import vueRouter from 'vue-router';
let innerI18n: vueI18n;
let innerRouter: vueRouter;

import { MessageBox } from 'element-ui';
function checkTimeout(data: any): void {
  if (!innerI18n || !innerRouter) {
    // tslint:disable-next-line:no-console
    console.warn('no setup for fetchUtil');
    return;
  }
  if (data.result === '0xff') {
    if (!window.timeoutFlag) {
      window.timeoutFlag = true;
      MessageBox.alert(String(innerI18n.t('header.timeoutMessage')), {
        type: 'warning',
        callback: () => {
          window.timeoutFlag = false;
          innerRouter.push('/');
        }
      });
    }
  }
}

function correctUrl(url: string) {
  return url.startsWith('http') || url.startsWith('/')
    ? url
    : window.APIHOST + url;
}

function formEncode(data: any) {
  let body = '';
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      body += `${key}=${data[key]}&`;
    }
  }
  return body.slice(0, -1);
}

function setup(i18n: vueI18n, router: vueRouter) {
  innerI18n = i18n;
  innerRouter = router;
}

function get(url: string) {
  const correctedUrl = correctUrl(url);
  return fetch(correctedUrl, { credentials: 'include' })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('get error: ' + url);
      }
    })
    .then(resData => {
      checkTimeout(resData);
      return resData;
    });
}
function postForm(url: string, data: object) {
  const correctedUrl = correctUrl(url);
  return fetch(correctedUrl, {
    method: 'POST',
    body: formEncode(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    credentials: 'include'
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('post error: ' + correctedUrl);
      }
    })
    .then(resData => {
      checkTimeout(resData);
      return resData;
    });
}
function postJSON(url: string, data: object) {
  const correctedUrl = correctUrl(url);
  return fetch(correctedUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    credentials: 'include'
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('post error: ' + correctedUrl);
      }
    })
    .then(resData => {
      checkTimeout(resData);
      return resData;
    });
}

async function postJSONAwait(url: string, data: object) {
  const correctedUrl = correctUrl(url);
  const res = await fetch(correctedUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    credentials: 'include'
  });
  if (res.ok) {
    const resData = res.json();
    checkTimeout(resData);
    return resData;
  } else {
    throw new Error('post error: ' + correctedUrl);
  }
}

export default { setup, get, postForm, postJSON, postJSONAwait };
