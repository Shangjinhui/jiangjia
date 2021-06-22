<template>
	<div class="pt80">
		<my-header nav="1"></my-header>

		<div class="wid1200 marginauto mh850">
			<my-banner :banner="bannerList"></my-banner>

			<!--热门比赛-->
			<div class="bgfff pd15 pb20 mb10 radius6">
				<div class="fsize18 bold pt20 pb20">热门比赛</div>
				<my-matchList ctype="1" :list="hotList_now"></my-matchList>
				<p class="center mt20 color cursor" v-if="hotList.length>5&&hotList_now!=hotList" @click="hotList_now = hotList">查看更多 ></p>
			</div>

			<!--热门推荐-->
			<div class="bgfff  mb50 radius6">
				<div class="fsize18 bold pt20 pb20 pd15">热门推荐</div>

				<div class="pd22 pb30">
					<div class="f-cb  fsize12 mt10 mb20">
						<router-link :to="{ name: 'expertDetail', query: {id:item.id} }" class="fl home-expert"  v-for="(item,index) in recommendList" :key="index">
							<div class="rel home-expert-tx marginauto mb5">
								<img :src="item.avatar" class="img-cover radius img1 block"/>
								<img src="../assets/img/home-ico2.png" class="abs img2"/>
							</div>
							<div class="row1 mb5">{{item.nickName}}</div>
							<div class="home-hot-tx rel" >
								<div class="rel row1" v-if="item.label">{{item.label}}</div>
								<div class="rel row1" v-else-if="item.continueFocus>=3">{{item.continueFocus}}连红</div>
								<div class="rel row1" v-else-if="item.focus>=10">近20中{{item.focus}}</div>
								<div class="rel row1" v-else-if="item.articleCount>0&&item.focusArticleCount>0">总{{item.articleCount}}中{{item.focusArticleCount}}</div>
							</div>
						</router-link>
						<router-link v-if="recommendList.length!=0" :to="{ name: 'expert'}" class="fl home-expert">
							<div class="home-expert-more"><i class="el-icon-more"></i></div>
							<div class="co8b8b8b">更多专家</div>
						</router-link>
						<no-data v-if="recommendList.length==0"></no-data>
					</div>

					<div class="fb fsize16 center lh46 home-lable mb10 bold">
						<div class="item-flex-1 cursor" :class="[{'on':item.id==type}]" v-for="(item,index) in typeList" :key="index" @click="changeTab(item.id)">{{item.name}}</div>
					</div>


					<!--解说列表-->
					<my-explain :list="list"></my-explain>
					<p class="center mt20 color cursor" v-if="list.length<total" @click="loadMore">查看更多 ></p>
				</div>

			</div>
		</div>


		<my-footer></my-footer>

	</div>

</template>
<script>
import Header from "../components/header";
import Banner from "../components/banner";
import Explain from "../components/explain";
import MatchList from "../components/matchList";
import Footer from "../components/footer";
import noData from '@/components/noData'
export default {
	name: 'index',
	components: {
		"my-header": Header,
		"my-banner": Banner,
		"my-explain": Explain,
		"my-matchList": MatchList,
		"my-footer": Footer,
		noData
	},
	data() {
		return {
			bannerList:[],              //banner
			hotList:[],                 //热门比赛
			hotList_now:[],             //热门比赛多了一次性显示完太长，所以先展示8条
			recommendList:[],          //热门推荐
			typeList: [                 //解说列表导航
				{ id: 1, name: '人  气' },
				{ id: 2, name: '命中率' },
			],
			type:1,                     //当前选中解说列表id
			list:[],                    //解说列表
			page:1,
			limit:6,
			total:0,
			timer:null,               //首页推荐也需要定时刷新
		};
	},
	created() {


	},
	mounted() {
		// this.getIndexData();
		// this.getHot();
		this.getCon();

	},
	methods: {
		// getIndexData(){
		// 	let data = {
		// 		page:1,
		// 		limit:1
		// 	}
		// 	this.$fetch('/api/common/index_pc',data).then(res=>{
		// 		if(res.data.returnCode=='0000'){
		// 			const data=res.data.data;
		// 			this.bannerList=data.banner;
		// 			this.recommendList = data.expert.splice(0,7);
		// 		}else{
		// 			this.$message(res.data.msg)
		// 		}
		// 	})
		// },
		changeTab(id){
			if(id == this.type) return;
			this.type = id;
			this.page = 1;
			this.list = [];
			this.getCon();
		},
		getCon(load=true){
			clearTimeout(this.timer);
			let data = {page:this.page,limit:this.limit,type:this.type}
			this.$fetch('/api/common/index_pc',data,'GET',load).then(res=>{
				if(res.data.returnCode=='0000'){
					let result = res.data.data;
					let list = [...this.list,...result.article.data];
					this.total = result.article.count;
					this.list = list;
					//---------------
					this.bannerList=result.banner;
					this.bannerList = this.addFour(result.banner)
					this.recommendList = result.expert.splice(0,7);
					//this.hotList = result.match;
					this.divideTime(result.match);

					this.timer = setTimeout(()=>{
						this.getCon(false);
					},60000)
				}else{
					this.$message(res.data.msg)
				}
			})
		},
		addFour(list){
			if(list.length==1){
				return [...list,list[0],list[0],list[0]];
			}else if(list.length==2){
				return [...list,list[0],list[1]];
			}else if(list.length==3){
				return [...list,list[0]];
			}else{
				return list;
			}
		},
		divideTime(list){
			if(list.length==0) return;
			//先排序
			list.sort(this.compare('match_time'));
			//第一个数据判断是否为当天，不是在展示
			let oneDate = new Date(list[0].match_time*1000),thisDate = new Date();
			if(oneDate.getMonth()!=thisDate.getMonth()||(oneDate.getMonth()==thisDate.getMonth()&&oneDate.getDate()!=thisDate.getDate())){
				list[0].divide_time = true;
			}
			//找日期差
			for(let i=1;i<list.length;i++){
				let nowDate = new Date(list[i].match_time*1000),lastDate = new Date(list[i-1].match_time*1000);
				list[i].divide_time = false;
				if(nowDate.getMonth()!=lastDate.getMonth()||(nowDate.getMonth()==lastDate.getMonth()&&nowDate.getDate()!=lastDate.getDate())){
					list[i].divide_time = true;
				}
			}
			this.hotList = list;
			this.hotList_now = list.splice(0,5);
		},
		compare(property){
			return function(a,b){
				var value1 = a[property];
				var value2 = b[property];
				return value1 - value2;
			}
		},
		loadMore(){
			//console.log(this.list.length,this.total)
			if(this.list.length>=this.total) return;
			this.page++;
			this.getCon();
		},
		// getHot(){
		// 	let data = {
		// 		page:1,
		// 		limit:1
		// 	}
		// 	this.$fetch('/api/common/index_pc',data).then(res=>{
		// 		//console.log(res)
		// 		if(res.data.returnCode=='0000'){
		// 			this.hotList = res.data.data.match;
		// 			console.log(this.hotList)
					
		// 		}else{
		// 			this.$message(res.data.msg)
		// 		}
		// 	})
		// }
	}
};

</script>

<style lang="scss">
	@import '../assets/css/index';

	body{
		background: $bodyBg;
	}
	img{display:inline-block;}
</style>
