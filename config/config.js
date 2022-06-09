import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/',
          redirect: '/trade/summary',
        },
        {
          path: '/user',
          layout: false,
          routes: [
            {
              path: '/user/login',
              layout: false,
              name: 'login',
              component: './user/Login',
            },
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          name: 'trade',
          icon: 'link',
          path: '/trade',

          routes: [
            {
              name: 'summary',
              path: '/trade/summary',
              component: './trade/summary',
              icon: 'earth'
            },
            {
              name: 'history',
              path: '/trade/history',
              component: './trade/history',
              icon: 'earth',
              hideInMenu: true
            },
            {
              name: 'unascertained',
              path: '/trade/unascertained',
              component: './trade/unascertained',
              icon: 'earth'
            },
            {
              name: 'chain',
              path: '/trade/chain',
              component: './trade/chain',
              icon: 'earth'
            },
            {
              component: '404',
            },
          ]
        },
        {
          name: 'account',
          icon: 'user',
          path: '/account',
          hideInMenu: true,
          routes: [
            {
              path: '/account',
              redirect: '/account/center',
            },
            {
              name: 'center',
              icon: 'smile',
              path: '/account/center',
              component: './account/center',
            },
            {
              name: 'settings',
              icon: 'smile',
              path: '/account/settings',
              component: './account/settings',
            },
          ],
        },
      ]
    },


    {
      component: '404',
    },
  ],
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},

});
