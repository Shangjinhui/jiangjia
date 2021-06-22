<template>
    <div>
        <self-header></self-header>
        <div class="self-con wid1200 flex-sp-top mh850">
            <self-side></self-side>
            <div class="self-con-right">
                <self-messagedetail v-if="tabI == 6&&detail == 6"></self-messagedetail>
                <keep-alive>
                    <self-recharge v-if="tabI == 0"></self-recharge>
                    <self-order v-if="tabI == 1"></self-order>
                    <self-quan v-if="tabI == 2"></self-quan>
                    <self-follow v-if="tabI == 3"></self-follow>
                    <self-userinfo v-if="tabI == 4"></self-userinfo>
                    <self-acountsafe v-if="tabI == 5"></self-acountsafe>
                    <self-message v-if="tabI == 6&&detail != 6"></self-message>
                </keep-alive>
            </div>
        </div>
        <my-footer></my-footer>
    </div>
</template>

<script>
import myFooter from '@/components/footer'
import selfHeader from '@/components/selfHeader'
import selfSide from '@/components/selfSideTab'
import selfRecharge from '@/components/selfRecharge'
import selfOrder from '@/components/selfOrder'
import selfQuan from '@/components/selfQuan'
import selfFollow from '@/components/selfFollow'
import selfUserinfo from '@/components/selfUserInfo'
import selfAcountsafe from '@/components/selfAcountSafe'
import selfMessage from '@/components/selfMessage'
import selfMessagedetail from '@/components/selfMessageDetail'


export default {
    components:{myFooter,selfHeader,selfSide,selfRecharge,selfOrder,selfQuan,selfFollow,selfUserinfo,selfAcountsafe,selfMessage,selfMessagedetail},
	data(){
		return {
            tabI:0,     //侧导航下标
            detail:0,   //导航下标对应详情页下标
        }
    },
    mounted(){
        //刷新页面
        this.tabI = this.$route.query.ind||0;
        this.detail = this.$route.query.detail||0;
    },
    computed:{
        ind(){
            return this.$route.query.ind
        },
        ind2(){
            return this.$route.query.detail
        }
    },
    watch:{
        //导航切换
        ind(val,oval){
            this.tabI = val;
        },
        ind2(val,oval){
            this.detail = val;
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/index';
@import '../assets/css/color';
img{display:block;object-fit: cover;}
.self-con{
    margin:90px auto 0;
}
.self-con-right{
    width:970px;
    background-color:#fff;
    padding:0 40px;
    box-sizing: border-box;
}
// 个人中心分页器样式
.el-pagination{
    margin-top:34px;
    text-align: center;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color:$color;
    color:#fff;
}
.el-pagination.is-background .el-pager li:hover{color:$color;}
</style>