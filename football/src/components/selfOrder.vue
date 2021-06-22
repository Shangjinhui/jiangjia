<template>
    <div class="order-out">
        <p class="h3">我的订单</p>
        <ul class="order-list-ul">
            <router-link tag="li" :to="{path:'/expertArticle',query:{id:item.about_id}}" class="order-list cursor" v-for="(item,index) in list" :key="index">
                <div class="top flex-sp">
                    <p class="time">{{item.createTime}}</p>
                    <div class="flex">
                        <p class="paynum mr10">支付状态: <span class="bold">{{item.orderStaus==1?'已支付':(item.type==2?'已退款':'')}}</span></p>
                        <p class="paynum">支付金币: <span class="bold">{{item.payPrice}}金币</span></p>
                    </div>
                    
                </div>
                <ul>
                    <li>购买类型：{{item.type==1?'文章':(item.type==2?'直播':'')}}</li>
                    <li class="row1">名称：{{item.title}}</li>
                    <li>专家：{{item.expert}}</li>
                </ul>
            </router-link>
            <no-data text="暂无订单~" v-if="list.length==0"></no-data>
        </ul>
        <!-- 分液器 -->
        <el-pagination
        background
        layout="prev, pager, next"
        :page-size="limit"
        :total="total"
        @current-change="changePage">
        </el-pagination>
    </div>
</template>

<script>
import noData from '@/components/noData'
export default {
	components:{noData},
	data(){
		return {
            page:1,
            limit:5,
            total:0,
			list:[],    //订单列表
		}
    },
    mounted(){
        this.getList();
    },
    methods:{
        getList(){
            this.$fetch('/api/expert/my_order',{page:this.page,limit:this.limit}).then(res=>{
                if(res.data.returnCode == '0000'){
                    this.total = res.data.data.count;
                    this.list = res.data.data.data;
                }else{
                    this.$message(res.data.msg)
                }
            })
        },
        changePage(page){
            this.page = page;
            this.getList();
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';

.order-out{
    padding-bottom:80px;
    .h3{
        font-size:18px;
        color:#333;
        line-height:70px;
        border-bottom:1px solid #f5f5f5;
    }
    .order-list-ul{min-height:550px;}
    .order-list{
        width:100%;
        min-height:140px;
        border-radius: 4px;
        border:1px solid #f2f2f2;
        padding-left:24px;
        box-sizing: border-box;
        color:#666;
        margin-top:18px;
        .top{
            height:40px;
            padding-right:24px;
            font-size:12px;
            border-bottom:1px solid #f2f2f2;
            .time{color:#333;}
            .paynum{span{color:$color;}}
        }
        ul{
            font-size:14px;
            padding-top:15px;
            width:742px;
            li{margin-bottom:10px;}
        }
    }

}
</style>