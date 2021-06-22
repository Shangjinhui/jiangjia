
const state = {
  loginShow:false,
}

const mutations = {
  SET_LOGINSHOW: (state, show) => {   
      state.loginShow = show;
  },
}
const actions = {
  
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}