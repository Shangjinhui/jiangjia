<template>
  <div id="app">
    <h1 id="seo_h1" style="height:0;overflow: hidden;">{{keywords}},{{description}}</h1>
    <keep-alive>
      <router-view v-if="$route.meta.cache&&routerAlive"></router-view>
    </keep-alive>
      <router-view v-if="!$route.meta.cache&&routerAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
  //跳转同一页面：摧毁重建
  data(){
    return{
      routerAlive:true,
      title:'进球哨',
      keywords:'进球哨,体育资讯,体育比分',
      description:'进球哨,体育资讯,体育比分'
    }
  },
  metaInfo () {
    return {
      title: this.title,
      meta: [{
        name: 'keywords',
        content: this.keywords
      },{
        name: 'description',
        content: this.description
      }]
    }
  },
  provide(){
    return {
      routerRefresh: this.routerRefresh
    }
  },
  created(){
    this.getMeta();
  },
  methods:{
    routerRefresh(){
      this.routerAlive = false;
      this.$nextTick(()=>{
          this.routerAlive = true;
      });
    },
    getMeta(){
      this.$fetch('/api/common/seo',{},'GET',false).then(res=>{
        if(res.data.returnCode == '0000'){
            this.keywords = res.data.data.keywords;
            this.description = res.data.data.description;
        }else{
            that.$message(res.data.msg);
        }
      })
    }
  }
};
</script>

