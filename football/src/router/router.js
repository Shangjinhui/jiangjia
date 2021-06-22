import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/pages/index'),
            meta:{cache:true}
        },
        {
            path: '/recommend',
            name: 'recommend',
            component: () => import('@/pages/recommend'),
            meta:{cache:true}
        },
        {
            path: '/expertArticle',
            name: 'expertArticle',
            component: () => import('@/pages/expertArticle'),
            meta:{cache:false}
        },
        {
            path: '/match',
            name: 'match',
            component: () => import('@/pages/match'),
            meta:{cache:true}
        },
        {
            path: '/expert',
            name: 'expert',
            component: () => import('@/pages/expert'),
            meta:{cache:true}
        },
        {
            path: '/expertDetail',
            name: 'expertDetail',
            component: () => import('@/pages/expertDetail'),
            meta:{cache:false}
        },
        // {
        //     path: '/expertList',
        //     name: 'expertList',
        //     component: () => import('@/pages/expertList'),
        //     meta:{cache:true}
        // },
        {
            path: '/appDownload',
            name: 'appDownload',
            component: () => import('@/pages/appDownload'),
            meta:{cache:true}
        },
        {
            path: '/selfCenter',
            name: 'selfCenter',
            component: () => import('@/pages/selfCenter'),
            meta:{cache:false}
        },
        {
            path: '/footerText',
            name: 'footerText',
            component: () => import('@/pages/footerText'),
            meta:{cache:true}
        },
        {
            path: '/editPage',
            name: 'editPage',
            component: () => import('@/pages/editPage'),
            meta:{cache:true}
        }
    ]
})
export default router