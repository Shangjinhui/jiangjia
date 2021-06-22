<template>
    <div class="self-message-page">
        <p class="h3">消息中心</p>
        <ul class="message-con">
            <li class="cursor" v-for="(item,index) in list" :key="index" @click="goDetail(item.id,item.type,index)">
                <div class="flex-top">
                    <div class="read-icon" :class="[{'on':item.isRead==0}]"></div>
                    <p class="title fsize14 co333 flex-son row1">{{item.title}}</p>
                </div>
                <div class="flex-sp">
                    <p class="desc fsize12 flex-son row1">{{item.description}}</p>
                    <p class="time fsize12">{{item.createTime}}</p>
                </div>
            </li>
            <no-data text="暂无消息~" v-if="list.length==0"></no-data>
        </ul>
        <!-- 分页器 -->
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
            limit:12,
            total:0,
            list:[]
		}
    },
    mounted(){
        this.getList();
    },
    methods:{
        getList(){
            this.$fetch('/api/common/notice_list',{page:this.page,limit:this.limit}).then(res=>{
                if(res.data.returnCode == '0000'){
                    this.total = res.data.data.count;
                    this.list = res.data.data.result;
                }else{
                    this.$message(res.data.msg)
                }
            })
        },
        changePage(page){
            this.page = page;
            this.getList();
        },
        goDetail(id,type,index){
            this.list[index].isRead = 1;
            this.setIsread(id,type);
            this.$router.push({path:'/selfCenter',query:{ind:6,detail:6,id}});
        },
        setIsread(id,type){
            this.$fetch('/api/common/read_notice',{id,type}).then(res=>{
                
            })
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';
.self-message-page{
    .h3{
        font-size:18px;
        color:#333;
        line-height:70px;
        border-bottom:1px solid #f5f5f5;
    }
    .message-con{
        min-height:550px;
        li{
            width:100%;
            height:78px;
            border-bottom:1px solid #f5f5f5;
            padding:20px 0 14px;
            box-sizing: border-box;
            .read-icon{
                width:30px;
                height:16px;
                background:url('../assets/img/read.png') no-repeat;
                &.on{
                    background:url('../assets/img/reads.png') no-repeat;
                }
            }
            .desc,.time{color:#a7a7a7;margin-top:10px;}
            .desc{margin-left:30px;}
        }
    }
}
</style>