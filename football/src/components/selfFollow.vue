<template>
    <div class="follow-out">
        <p class="h3">我的关注</p>
        <div class="follow-con">
            <ul class="follow-con-ul flex-sp flex-wrap">
                <router-link tag="li" class="flex cursor" :to="{name:'expertDetail',query:{id:item.expert.id}}" v-for="(item,index) in list" :key="index">
                    <img class="avatar" :src="item.expert.avatar" alt="">
                    <div class="con">
                        <div class="flex">
                            <p class="name">{{item.expert.nickName}}</p>

                            <div class="flex">
								<!-- <div class="home-hot-tx rel ml5" v-if="item.expert.label">
									<div class="rel row1">{{item.expert.label}}</div>
								</div>
								<div v-else>
									<div class="home-hot-tx rel ml5" v-if="item.expert.continueFocus>=3">
										<div class="rel row1">{{item.expert.continueFocus}}连红</div>
									</div>
									<div class="home-hot-tx rel ml5" v-if="item.expert.focus>=10">
										<div class="rel row1">近20中{{item.expert.focus}}</div>
									</div>
									<div class="home-hot-tx rel ml5" v-if="(item.expert.continueFocus<3||item.expert.focus<10)&&item.expert.articleCount>0&&item.expert.focusArticleCount>0">
										<div class="rel row1">总{{item.expert.articleCount}}中{{item.expert.focusArticleCount}}</div>
									</div>
								</div> -->
                                <div class="home-hot-tx rel fl ml5" v-if="item.expert.label">
									<div class="rel row1">{{item.expert.label}}</div>
								</div>
								<div class="home-hot-tx rel fl ml5" v-if="item.expert.continueFocus>=3">
									<div class="rel row1">{{item.expert.continueFocus}}连红</div>
								</div>
								<div class="home-hot-tx rel fl ml5" v-if="(!item.expert.label||item.expert.continueFocus<3)&&item.expert.focus>=10">
									<div class="rel row1">近20中{{item.expert.focus}}</div>
								</div>
								<div class="home-hot-tx rel fl ml5" v-if="((!item.expert.label&&item.expert.continueFocus<3)||(!item.expert.label&&item.expert.focus<10)||(item.expert.continueFocus<3&&item.expert.focus<10))&&item.expert.articleCount>0&&item.expert.focusArticleCount>0">
									<div class="rel row1">总{{item.expert.articleCount}}中{{item.expert.focusArticleCount}}</div>
								</div>
							</div>
                            
                        </div>
                        <p class="desc row2">{{item.expert.intro}}</p>
                        <div class="gou" @click.stop="cancleCollect(item.expert.id)"></div>
                    </div>
                </router-link>
                <no-data text="暂无关注~" v-if="list.length==0"></no-data>
            </ul>
            
        </div>
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
            limit:10,
            total:0,
			list:[
               
            ]
		}
    },
    mounted(){
        this.getList();
    },
    methods:{
        getList(){
            this.$fetch('/api/expert/expert_collect_list',{page:this.page,limit:this.limit}).then(res=>{
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
        },
        cancleCollect(id){
            this.$fetch('/api/expert/collect_expert',{id,type:2}).then(res=>{
                if(res.data.returnCode == '0000'){
                    this.$message({message:'取关成功',type:'success'})
                    this.getList();
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';
.follow-out{
    .h3{
        font-size:18px;
        color:#333;
        line-height:70px;
        border-bottom:1px solid #f5f5f5;
    }
    .follow-con{
        min-height:550px;
    }
    .follow-con-ul{
        li{
            width:430px;
            height:88px;
            border-bottom:1px solid #f4f4f4;
            margin-top:20px;
            position: relative;
            .avatar{
                width:55px;
                height:55px;
                border-radius: 50%;
                margin-right:12px;
            }
            .name{
                font-size:14px;
                color:#333;
                margin-right:12px;
            }

            .desc{
                min-height:49px;
                padding-top:13px;
                font-size:12px;
                line-height:18px;
                color:#999;
            }
            .gou{
                width:28px;
                height:28px;
                background:#f2f2f2 url('../assets/img/gou.png') center no-repeat;
                position:absolute;
                right:0;
                top:0;
            }
        }
    }
}
</style>