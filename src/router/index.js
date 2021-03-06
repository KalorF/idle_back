import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import login from '../views/login'
/**
 * hidden: true                   //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
                                  //当设置 noredirect 的时候该路由在面包屑导航中不可被点击
                                  //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
                                  //若你想不管路由下面的 children 声明的个数都显示你的根路由
                                  //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
* redirect: noredirect            //当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'              //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    title: 'title'               //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             //设置该路由的图标
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
    noCache: true                //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  }
**/
export const constantRouterMap = [
  {
    path: '/',
    component: login,
    name: 'login'
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserManagement',
    redirect: 'userManagement',
    meta: {
      title: '用户管理',
      breadcrumb: false,
      icon: 'tree'
    },
    children: [
      {
        path: '/userManagement',
        name: 'userManagement',
        component: () => import('@/views/userManagement/index'),
        meta: {
          title: '用户管理',
          icon: 'table'
        }
      }
    ]
  },
  {
    path: '/type',
    component: Layout,
    name: 'TypeManagement',
    redirect: 'typeManagement',
    meta: {
      title: '商品类型管理',
      breadcrumb: false,
      icon: 'tree'
    },
    children: [
      {
        path: '/typeManagement',
        name: 'typeManagement',
        component: () => import('@/views/typeManagement/index'),
        meta: {
          title: '商品类型管理',
          icon: 'table'
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    alwaysShow: false,
    name: 'goodsManagement',
    meta: {
      title: '兑换商品管理',
      breadcrumb: false,
      icon: 'tree'
    },
    children: [
      {
        path: '/goodsManagement',
        name: 'goodsManagement',
        component: () => import('@/views/goodsManagement/list'),
        meta: {
          title: '商品列表',
          icon: 'table'
        }
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/goodsManagement/order'),
        meta: {
          title: '兑换列表',
          icon: 'table'
        }
      }
    ]
  }
]

const router = new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export default router
