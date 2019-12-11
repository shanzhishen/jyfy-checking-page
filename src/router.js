import Vue from 'vue'
import Router from 'vue-router'

import ElementUI from 'element-ui';
import '@/assets/element-#4976C9/index.css';
import '../static/font-awesome/css/font-awesome.min.css';

Vue.use(ElementUI);
Vue.use(Router);

import Home from '@/views/Home';
import Welcome from '@/views/Welcome';
import Login from '@/views/Login';

import MonthCheck from '@/views/main/MonthCheck';
import UserChecking from '@/views/main/UserChecking';
import DailyScore from '@/views/main/DailyScore';
import ClassesData from '@/views/main/ClassesData';
import ChangeClassData from '@/views/main/ChangeClassData';
import FingerPrintData from '@/views/main/FingerPrintData';
import CheckInfo from '@/views/main/CheckInfo';
import DataDetail from '@/views/main/DataDetail';
import FinalData from '@/views/main/FinalData';
import UserStatus from '@/views/main/UserStatus';
import WatchLeaderScore from '@/views/main/WatchLeaderScore';
import WeekNewspaper from '@/views/project/WeekNewspaper';
import ProjectManager from '@/views/project/ProjectManager';

import BusinessStudy from '@/views/main/BusinessStudy';

// 解决重复推送同一个index的时候报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/Welcome',
          name: 'Welcome',
          component: Welcome
        },
        {
          path: '/MonthCheck',
          name: 'MonthCheck',
          component: MonthCheck        
        },
        {
          path: '/UserChecking',
          name: 'UserChecking',
          component: UserChecking        
        },
        {
          path: '/DailyScore',
          name: 'DailyScore',
          component: DailyScore        
        },
        {
          path: '/ClassesData',
          name: 'ClassesData',
          component: ClassesData        
        },
        {
          path: '/ChangeClassData',
          name: 'ChangeClassData',
          component: ChangeClassData        
        },
        {
          path: '/FingerPrintData',
          name: 'FingerPrintData',
          component: FingerPrintData        
        },
        {
          path: '/CheckInfo',
          name: 'CheckInfo',
          component: CheckInfo
        },
        {
          path: '/DataDetail',
          name: 'DataDetail',
          component: DataDetail
        },
        {
          path: '/FinalData',
          name: 'FinalData',
          component: FinalData
        },
        {
          path: '/WatchLeaderScore',
          name: 'WatchLeaderScore',
          component: WatchLeaderScore
        },
        {
          path: '/UserStatus',
          name: 'UserStatus',
          component: UserStatus
        },
        {
          path: '/WeekNewspaper',
          name: 'WeekNewspaper',
          component: WeekNewspaper
        },
        {
          path: '/ProjectManager',
          name: 'ProjectManager',
          component: ProjectManager
        },
        {
          path: '/BusinessStudy',
          name: 'BusinessStudy',
          component: BusinessStudy
        }
      ]
    },
    {
      path:'/Login',
      name: 'Login',
      component: Login
    }
  ]
})
