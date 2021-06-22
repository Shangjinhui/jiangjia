<template>
	<div>
		<div class="articleList-con">
			<div class="bor-boc6c6c6 pt20 pb15 block cursor" v-for="(item,index) in result.data" :key="index" @click="toDetail(item.id)">
				<div class="row2 fsize16 co666 mb10 lh20">{{item.title}}</div>
				<div class="bgf5f5f5 mb10 rel">
					<table>
						<tr class="expert-fl-con lh46">
							<td class=" coffc61a pl20" width="125">{{item.detail[0].match_name}}</td>
							<td class="co8b8b8b fsize12 center" width="85">{{item.detail[0].match_time|removeYearSecond}}</td>
							<td class=" right" width="135">{{item.detail[0].home}}</td>
							<td class="center co8b8b8b" width="60">{{item.detail[0].status==1||item.detail[0].status==2?item.detail[0].home_scores+':'+item.detail[0].away_scores:'VS'}}</td>
							<td class="" width="135">{{item.detail[0].away}}</td>
							<td></td>
						</tr>
					</table>
					<img v-if="item.detail[0].focus==1" src="@/assets/img/home-ico9.png" class="abs expert-fl-img">
					<img v-if="item.detail[0].focus==2" src="@/assets/img/home-ico10.png" class="abs expert-fl-img">
				</div>
				<div class="f-cb detail-bot co8b8b8b">
					<div class="fl fsize12 line rel">足球</div>
					<div class="fl fsize12"><img src="@/assets/img/home-ico3.png" class="fl">{{item.jSaleCount}}</div>
					<div class="fr color" v-if="item.price>0"><img src="@/assets/img/home-ico4.png" class="fl mr10">{{item.price}}金币</div>
					<p v-else class="fr col666">免费</p>
				</div>
			</div>
			<no-data v-if="result.data&&result.data.length==0"></no-data>
		</div>
		<el-pagination
		v-if="result.count>limit"
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
	inject:['routerRefresh'],   //在子组件中获取父或祖先里的方法
	components:{noData},
	props:{
		result: {
			type: Object,
			default: {count:0,data:[]}
		},
		ctype:{
			type:String,
			default:'1', //1解读详情
		},
		showPage:{
			type:Boolean,
			default:true, //是否需要分页
		}
	},
	data(){
		return {
			page:1,
			limit:4,
			total:0,
		}
	},
	mounted(){
		//console.log(this.result.data)
		this.$emit('changePage',this.page,this.limit);
	},
	methods:{
		changePage(page){
			this.$emit('changePage',page,this.limit);
		},
		toDetail(id){
			this.$router.push({path:'/expertArticle',query:{id}})
			this.routerRefresh();
		}
	},
	created(){},
	watch:{
		result(val){
			this.total = val.count;
		}
	},
	
}
</script>
<style lang="scss">
@import '../assets/css/color';

// .articleList-con{min-height:596px;}
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
