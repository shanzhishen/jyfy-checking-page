import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {   //要设置的全局访问的state对象
  checkInfo: {},
  checkedInfo: '',
  menu: {}
};

//getters，和vue计算属性computed一样，来实时监听state值的变化(最新状态)，并把它也仍进Vuex.Store里面
const getters = {   //实时监听state值的变化(最新状态)
  getCheckInfo(){
      return state.checkInfo;
  },
  getCheckedInfo(){
      return state.checkedInfo;
  },
  getMenu(){
      return state.menu;
  }
};
// this.$store.getters.getCheckInfo 

//mutattions也是一个对象，这个对象里面可以放改变state的初始值的方法
const mutations = {
  setCheckInfo(state,checkInfo) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
      state.checkInfo = checkInfo;
  },
  setCheckedInfo(state,checkedInfo) { 
      state.checkedInfo = checkedInfo;
  },
  setMenu(state,menu){
      state.menu = menu;
  }
};
// this.$store.commit('show',checkInfo)

//Action方法 可以包含任意异步操作，这里面的方法是用来异步触发mutations里面的方法
const actions = {
  setCheckInfo(context,checkInfo){
      context.commit('setCheckInfo',checkInfo)
  },
  setCheckedInfo(context,checkedInfo){
      context.commit('setCheckedInfo',checkedInfo)
  },
  setMenu(context,menu){
      context.commit('setMenu',menu)
  }
};
// this.$store.dispatch('setCheckInfo'，6) 

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
