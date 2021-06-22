<template>
    <div class="side">
        <div class="top" v-if="userInfo">
            <img class="avatar" :src="userInfo.avatar" alt="">
            <p class="username">{{userInfo.nickName}}</p>
        </div>
        <ul class="tab">
            <li class="flex cursor" v-for="(item,index) in navList" :key="index" @click="changeNav(index)">
                <img class="icon" :src="selected==index?item.sIcon:item.icon" alt="">
                <p :class="[{'title flex-son row1':true,'selected':selected==index}]">{{item.title}}</p>
                <img class="icon-right" :src="selected==index?require('@/assets/img/right-red.png'):require('@/assets/img/right.png')" alt="">
            </li>
        </ul>
    </div>
</template>

<script>
export default {
	components:{},
	data(){
		return {
			navList:[
                {
                    title:'金币充值',
                    icon:require('@/assets/img/selficon/coin.png'),
                    sIcon:require('@/assets/img/selficon/coin-s.png')
                },
                {
                    title:'我的订单',
                    icon:require('@/assets/img/selficon/order.png'),
                    sIcon:require('@/assets/img/selficon/order-s.png')
                },
                {
                    title:'我的优惠券',
                    icon:require('@/assets/img/selficon/quan.png'),
                    sIcon:require('@/assets/img/selficon/quan-s.png')
                },
                {
                    title:'我的关注',
                    icon:require('@/assets/img/selficon/star.png'),
                    sIcon:require('@/assets/img/selficon/star-s.png')
                },
                {
                    title:'基本信息',
                    icon:require('@/assets/img/selficon/info.png'),
                    sIcon:require('@/assets/img/selficon/info-s.png')
                },
                {
                    title:'账号与安全',
                    icon:require('@/assets/img/selficon/safe.png'),
                    sIcon:require('@/assets/img/selficon/safe-s.png')
                },
                {
                    title:'消息中心',
                    icon:require('@/assets/img/selficon/mess.png'),
                    sIcon:require('@/assets/img/selficon/mess-s.png')
                }
            ],
            selected:0,
		}
    },
    computed:{
		userInfo(){
			return this.$store.state.userInfo.userInfo
        },
        pathInd(){
            return this.$route.query.ind
        }
    },
    watch:{
        pathInd(val){
            this.selected = val||0;
        }
    },
    mounted(){
        this.selected = this.$route.query.ind||0;
        //页面返回
        window.addEventListener("popstate", ()=>{
            this.selected = this.$route.query.ind||0;
        }, false);
    },
    methods:{
        changeNav(ind){
            if(this.selected == ind) return;
            this.selected = ind;
            //console.log(this.$parent)
            //this.$parent.tabI = ind;
            this.$router.push({path:'/selfCenter',query:{ind}})
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';

.side{
    width:208px;
    min-height:490px;
    background-color:#fff;
    border-top:2px solid $color;
    padding:24px 12px;
    box-sizing: border-box;
    .top{
        .avatar{
            width:70px;
            height:70px;
            display:block;
            border-radius: 50%;
            margin:0 auto;
        }
        .username{
            font-size:14px;
            color:$grey;
            text-align: center;
            margin-top:10px;
        }
    }
    .tab{
        width:100%;
        
        li{
            margin-top:24px;
            padding-left:8px;
            .icon{
                width:32px;
                object-fit: none;
            }
            .title{
                font-size:14px;
                color:$grey;
                &.selected{color:$color;}
            }
            &:nth-of-type(4n+1){
                border-top:1px solid #f5f5f5;
                padding-top:24px;
            }
        }
        
    }
}
</style>