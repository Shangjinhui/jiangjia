<template>
    <div class="quan-out">
        <p class="h3">我的优惠券</p>
        <ul class="flex-sp flex-wrap">
            <li class="flex" :class="[{'gary':item.status!=0}]" v-for="(item,index) in list" :key="index">
                <div class="quan-l">
                    <p class="type row1">{{item.name}}</p>
                    <p class="time">有效期：{{item.startTime}} - {{item.overTime}}</p>
                </div>
                <p class="zhe flex-son DINCond-Bold"><span class="bold">{{item.discount}}</span>折</p>
                <router-link v-if="item.status==0" class="use flex-center cursor" :to="{path:'/'}">立即<br/>使用</router-link>
                <p v-else-if="item.status==1" class="use flex-center cursor">已使用</p>
                <p v-else class="use flex-center cursor">已过期</p>
            </li>
            <no-data text="暂无优惠券~" v-if="list.length==0"></no-data>
        </ul>
    </div>
</template>

<script>
import noData from '@/components/noData'
export default {
	components:{noData},
	data(){
		return {
            list:[]
		}
    },
    mounted(){
        this.getList();
    },
    methods:{
        getList(){
            this.$fetch('/api/member/my_coupon').then(res=>{
                if(res.data.returnCode == '0000'){
                    this.list = res.data.data.list;
                }else{
                    this.$message(res.data.msg);
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';
.quan-out{
    min-height:556px;
    .h3{
        font-size:18px;
        color:#333;
        line-height:70px;
        border-bottom:1px solid #f5f5f5;
    }
    ul{
        padding-top:20px;
        li{
            width:418px;
            height:76px;
            background:url('../assets/img/quan-bg.png') 0 0/cover no-repeat;
            margin-bottom:30px;
            &.gary{
                -webkit-filter: grayscale(1);
                filter: grayscale(1);
                opacity: 0.5;
            }
            .quan-l{
                width:252px;
                padding:16px 18px;
                box-sizing: border-box;
                .type{
                    font-size:16px;
                    color:#333;
                }
                .time{
                    font-size:12px;
                    color:#999;
                    margin-top:8px;
                }
            }
            .zhe{
                font-size:16px;
                color:$color;
                span{
                    font-size:22px;
                }
            }
            .use{
                width:65px;
                height:100%;
                    font-size: 13px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
            }
            // &:nth-of-type(2n){margin-right:0;}
        }
    }
}
</style>