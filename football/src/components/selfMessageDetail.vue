<template>
    <div class="self-mess-detail">
        <p class="title fsize22 co333 mb30">{{detail&&detail.title}}</p>
        <p class="time fsize12 coa7a7a7 pb30">发布时间：{{detail&&detail.createTime}}</p>
        <p class="desc fsize14 co333 pt20" v-html="detail&&detail.content"></p>
        <div class="flex-reverse">
            <router-link class="back-list fsize12cursor" :to="{path:'/selfCenter',query:{ind:6}}">返回列表</router-link>
        </div>
        
    </div>
</template>

<script>
export default {
	components:{},
	data(){
		return {
            detail:null
		}
    },
    mounted(){
        const id = this.$route.query.id
        this.getDetail(id);
    },
    methods:{
        getDetail(id){
            this.$fetch('/api/common/notice_info',{id}).then(res=>{
                if(res.data.returnCode == '0000'){
                    this.detail = res.data.data;
                }else{
                    this.$message(res.data.msg)
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';
.self-mess-detail{
    min-height:560px;
    padding:50px 0;
    box-sizing: border-box;
    .time{
        border-bottom:1px solid #f5f5f5;
    }
    .desc{
        min-height:400px;
        line-height:24px;
        padding-bottom:80px;
        border-bottom:1px solid #f5f5f5;
        
    }
    .back-list{
        color:#7a7a7a;
        width:82px;
        line-height:26px;
        text-align: center;
        border:1px solid #bfbfbf;
        border-radius: 2px;
        margin-top:28px;
        background:url('../assets/img/back.png') 8px center no-repeat;
        text-indent: 12px;
    }
}
</style>