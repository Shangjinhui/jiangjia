<template>
	<div class="pt80">
		<my-header></my-header>
		<div class="mh850">
		<div class="wid1200 marginauto f-cb pb50" v-if="articleDetail">
			<div class="fl bgfff radius4 expert-fl">
				<div class="fsize24 lh30 mb15">
					{{articleDetail.title}}
				</div>
				<div class="fsize12 co8b8b8b mb20">
					<span class="bor-ric6c6c6 pr10 mr10">{{articleDetail.expert.nickName}}发表于 {{articleDetail.createTime|removeYearSecond}} </span>
					<span class="bor-ric6c6c6  pr10 mr10">足球</span>
					<span class="">开赛时间：{{articleDetail.match[0].match_time|removeYearSecond}}</span>
				</div>
				<div class="rel bgf5f5f5 expert-fl-tx co666 mb20">
					<img src="../assets/img/home-ico5.png" class="abs img1">
					<img src="../assets/img/home-ico5.png" class="abs img2">
					{{articleDetail.description}}
				</div>

				<!--未付费         未解锁可购买情况显示-->
				<div class="bor-boc6c6c6 pb50 mb20" v-if="articleDetail.haveOpen==0&&articleDetail.canBuy==1">
					<div class="center expert-fl-match mb5" v-for="(item,index) in articleDetail.match" :key="index">
						<div class="co999 mb15">{{item.match_time|switchWeek}}    <span class="ml10 mr10">{{item.match_name}}</span>    {{item.match_time|removeSrcond}} </div>
						<table class="marginauto wid420">
							<tr>
								<td>
									<img :src="item.home_logo" class="img1">
									<div>{{item.home}}</div>
								</td>
								<td width="162">{{item.status!=0?item.home_scores+'-'+item.away_scores:'VS'}}</td>
								<td>
									<img :src="item.away_logo" class="img1">
									<div>{{item.away}}</div>
								</td>
							</tr>
						</table>
					</div>
					<div>
						<img src="../assets/img/home-ico6.png" class="block w100">
						<div class="fsize16  cofff bgcolor wid210 lh54 center radius4 marginauto cursor" @click="lookQuan">¥{{articleDetail.price}} 购买本场</div>
					</div>
				</div>
				<!--未付费-->


				<!--已付费      已解锁-->
				<div class="bor-boc6c6c6 pb50 mb20" v-if="articleDetail.haveOpen==1">
					<!-- 球赛与竞猜 -->
					<div class="mb30" v-for="(item,index) in articleDetail.match" :key="index">
						<div class="center expert-fl-match">
							<div class="co999 mb15">{{item.match_time|switchWeek}}    <span class="ml10 mr10">{{item.match_name}}</span>    {{item.match_time|removeSrcond}} </div>
							<table class="marginauto wid420">
								<tr>
									<td>
										<img :src="item.home_logo" class="img1">
										<div>{{item.home}}</div>
									</td>
									<td width="162">{{item.status!=0?item.home_scores+'-'+item.away_scores:'VS'}}</td>
									<td>
										<img :src="item.away_logo" class="img1">
										<div>{{item.away}}</div>
									</td>
								</tr>
							</table>
						</div>
						<!--竞彩单关     ?????????????????????????????????????-->
						<div class="rel" v-if="articleDetail.secret.type == 2||articleDetail.secret.type == 1">
							<table class="expert-match radius4 center ">
								<tr class="cofff">
									<td width="170"></td>
									<td width="139">让球</td>
									<td width="139">胜</td>
									<td width="139">平</td>
									<td>负</td>
								</tr>
								<!-- spf -->
								<tr>
									<td rowspan="2" class="cofff">{{articleDetail.secret.type == 2?'竞彩单关':'二串一'}}</td>
									<td>0<i class="abs el-icon-check"></i></td>
									<td :class="[{'on':articleDetail.secret.detail[index].type==2&&(articleDetail.secret.detail[index].res==1||articleDetail.secret.detail[index].res==4)}]">{{articleDetail.secret.detail[index].data.spf.split(',')[0]}}<i class="abs el-icon-check"></i></td>
									<td :class="[{'on':articleDetail.secret.detail[index].type==2&&(articleDetail.secret.detail[index].res==2||articleDetail.secret.detail[index].res==4||articleDetail.secret.detail[index].res==5)}]">{{articleDetail.secret.detail[index].data.spf.split(',')[1]}}<i class="abs el-icon-check"></i></td>
									<td :class="[{'on':articleDetail.secret.detail[index].type==2&&(articleDetail.secret.detail[index].res==3||articleDetail.secret.detail[index].res==5)}]">{{articleDetail.secret.detail[index].data.spf.split(',')[2]}}<i class="abs el-icon-check"></i></td>
								</tr>
								<!-- rq -->
								<tr>
									<td>{{articleDetail.secret.detail[index].data.rq.split(',')[0]}}<i class="abs el-icon-check"></i></td>
									<td :class="[{'on':articleDetail.secret.detail[index].type==1&&(articleDetail.secret.detail[index].res==1||articleDetail.secret.detail[index].res==4)}]">{{articleDetail.secret.detail[index].data.rq.split(',')[1]}}<i class="abs el-icon-check"></i></td>
									<td :class="[{'on':articleDetail.secret.detail[index].type==1&&(articleDetail.secret.detail[index].res==2||articleDetail.secret.detail[index].res==4||articleDetail.secret.detail[index].res==5)}]">{{articleDetail.secret.detail[index].data.rq.split(',')[2]}}<i class="abs el-icon-check"></i></td>
									<td :class="[{'on':articleDetail.secret.detail[index].type==1&&(articleDetail.secret.detail[index].res==3||articleDetail.secret.detail[index].res==5)}]">{{articleDetail.secret.detail[index].data.rq.split(',')[3]}}<i class="abs el-icon-check"></i></td>
								</tr>
							</table>
							<img v-if="articleDetail.secret.detail[index].focus==1" src="../assets/img/home-ico9.png" class="abs expert-match-img">
							<img v-if="articleDetail.secret.detail[index].focus==2" src="../assets/img/home-ico10.png" class="abs expert-match-img">
						</div>

						<!--亚盘-->
						<div class="rel" v-if="articleDetail.secret.type == 3">
							<table class="expert-match radius4 center ">
								<tr>
									<td width="170" class="cofff">玩法类型<div>让球</div></td>
									<td width="185" :class="[{'on':articleDetail.secret.detail[index].res==1||articleDetail.secret.detail[index].res==4}]"><div class="cofff">主胜</div><div>{{articleDetail.secret.detail[index].win}}<i class="abs el-icon-check"></i></div></td>
									<td width="185"><div class="cofff">让球</div><div>{{articleDetail.secret.detail[index].concedePoints}}</div></td>
									<td :class="[{'on':articleDetail.secret.detail[index].res==3||articleDetail.secret.detail[index].res==5}]"><div class="cofff">客胜</div><div>{{articleDetail.secret.detail[index].lost}}<i class="abs el-icon-check"></i></div></td>
								</tr>
							</table>
							<img v-if="articleDetail.secret.detail[index].focus==1" src="../assets/img/home-ico9.png" class="abs expert-match-img">
							<img v-if="articleDetail.secret.detail[index].focus==2" src="../assets/img/home-ico10.png" class="abs expert-match-img">
						</div>

						<!--北单胜负 v-if="articleDetail.secret.type == 5"-->
						<div class="rel" v-if="articleDetail.secret.type == 5">
							<table class="expert-match radius4 center ">
								<tr>
									<td width="170" class="cofff">玩法类型<div>北单胜负</div></td>
									<td width="185" :class="[{'on':articleDetail.secret.detail[index].res==1||articleDetail.secret.detail[index].res==4}]"><div class="cofff">主胜</div><div>{{articleDetail.secret.detail[index].win}}<i class="abs el-icon-check"></i></div></td>
									<td width="185"><div class="cofff">让球</div><div>{{articleDetail.secret.detail[index].concedePoints}}<i class="abs el-icon-check"></i></div></td>
									<td :class="[{'on':articleDetail.secret.detail[index].res==3||articleDetail.secret.detail[index].res==5}]"><div class="cofff">负</div><div>{{articleDetail.secret.detail[index].lost}}<i class="abs el-icon-check"></i></div></td>
								</tr>
							</table>
							<img v-if="articleDetail.secret.detail[index].focus==1" src="../assets/img/home-ico9.png" class="abs expert-match-img">
							<img v-if="articleDetail.secret.detail[index].focus==2" src="../assets/img/home-ico10.png" class="abs expert-match-img">
						</div>

						<!--北单胜平负 v-if="articleDetail.secret.type == 4"-->
						<div class="rel" v-if="articleDetail.secret.type == 4">
							<table class="expert-match radius4 center ">
								<tr>
									<td width="170" class="cofff">玩法类型<div>北单胜平负</div></td>
									<td width="139"><div class="cofff">让球</div><div>{{articleDetail.secret.detail[index].concedePoints}}<i class="abs el-icon-check"></i></div></td>
									<td :class="[{'on':articleDetail.secret.detail[index].res==1||articleDetail.secret.detail[index].res==4}]" width="139"><div class="cofff">胜</div><div>{{articleDetail.secret.detail[index].win}}<i class="abs el-icon-check"></i></div></td>
									<td width="139" :class="[{'on':articleDetail.secret.detail[index].res==2||articleDetail.secret.detail[index].res==4||articleDetail.secret.detail[index].res==5}]"><div class="cofff">平</div><div>{{articleDetail.secret.detail[index].flat}}<i class="abs el-icon-check"></i></div></td>
									<td :class="[{'on':articleDetail.secret.detail[index].res==3||articleDetail.secret.detail[index].res==5}]"><div class="cofff">负</div><div>{{articleDetail.secret.detail[index].lost}}<i class="abs el-icon-check"></i></div></td>
								</tr>
							</table>
							<img v-if="articleDetail.secret.detail[index].focus==1" src="../assets/img/home-ico9.png" class="abs expert-match-img">
							<img v-if="articleDetail.secret.detail[index].focus==2" src="../assets/img/home-ico10.png" class="abs expert-match-img">
						</div>
					</div>

					<!-- <div>
						<div class="center expert-fl-match">
							<div class="co999 mb15">星期三    <span class="ml10 mr10">日职乙</span>    2020-09-09 18:00 </div>
							<table class="marginauto wid420">
								<tr>
									<td>
										<img src="../assets/img/banner.png" class="img1">
										<div>利物浦</div>
									</td>
									<td width="162" class="fsize24 DINCond-Bold">119  : 110</td>
									<td>
										<img src="../assets/img/banner.png" class="img1">
										<div>利物浦</div>
									</td>
								</tr>
							</table>
						</div>
						
						<div class="rel">
							<table class="expert-match radius4 center ">
								<tr class="cofff">
									<td width="170"></td>
									<td width="139">让球</td>
									<td width="139">胜</td>
									<td width="139">平</td>
									<td>负</td>
								</tr>
								<tr>
									<td rowspan="2" class="cofff">竞彩二串一</td>
									<td>0<i class="abs el-icon-check"></i></td>
									<td>1<i class="abs el-icon-check"></i></td>
									<td class="on">2<i class="abs el-icon-check"></i></td>
									<td>3<i class="abs el-icon-check"></i></td>
								</tr>
								<tr>
									<td>0<i class="abs el-icon-check"></i></td>
									<td>1<i class="abs el-icon-check"></i></td>
									<td>2<i class="abs el-icon-check"></i></td>
									<td>3<i class="abs el-icon-check"></i></td>
								</tr>
							</table>
							<img src="../assets/img/home-ico9.png" class="abs expert-match-img">
						</div>
					</div> -->






					<div class="mt40 lh24" v-html="articleDetail.secret.content">
						
					</div>
				</div>



				<!--其他解读-->
				<div class="color bold fsize22 expert-fl-tit mb20">其他解读</div>
				<my-articleList ctype="1" :result="otherList" @changePage="changePage"></my-articleList>

			</div>

			<div class="fr expert-fr">
				<div class="bgfff radius4 center pd22 pt30 pb20 mb30">
					<router-link tag="div" class="rel home-expert-tx home-expert-tx1 marginauto mb15 cursor" :to="{name:'expertDetail',query:{id:articleDetail.expert.id}}">
						<img :src="articleDetail.expert.avatar" class="img-cover radius img1 block"/>
						<img src="../assets/img/home-ico2.png" class="abs img2"/>
					</router-link>
					<div class="fsize18 mb10">{{articleDetail.expert.nickName}}</div>

					<div class="fsize12 mb5">
						<!-- <div class="home-hot-tx rel ml5" v-if="articleDetail.expert.label">
							<div class="rel row1">{{articleDetail.expert.label}}</div>
						</div>
						<div v-else>
							<div class="home-hot-tx rel ml5" v-if="articleDetail.expert.continueFocus>=3">
								<div class="rel row1">{{articleDetail.expert.continueFocus}}连红</div>
							</div>
							<div class="home-hot-tx rel ml5" v-if="articleDetail.expert.focus>=10">
								<div class="rel row1">近20中{{articleDetail.expert.focus}}</div>
							</div>
							<div class="home-hot-tx rel ml5" v-if="(articleDetail.expert.continueFocus<3||articleDetail.expert.focus<10)&&articleDetail.expert.articleCount>0&&articleDetail.expert.focusArticleCount>0">
								<div class="rel row1">总{{articleDetail.expert.articleCount}}中{{articleDetail.expert.focusArticleCount}}</div>
							</div>
						</div> -->
						<div class="home-hot-tx rel ml5" v-if="articleDetail.expert.label">
							<div class="rel row1">{{articleDetail.expert.label}}</div>
						</div>
						<div class="home-hot-tx rel ml5" v-if="articleDetail.expert.continueFocus>=3">
							<div class="rel row1">{{articleDetail.expert.continueFocus}}连红</div>
						</div>
						<div class="home-hot-tx rel ml5" v-if="(!articleDetail.expert.label||articleDetail.expert.continueFocus<3)&&articleDetail.expert.focus>=10">
							<div class="rel row1">近20中{{articleDetail.expert.focus}}</div>
						</div>
						<div class="home-hot-tx rel ml5" v-if="((!articleDetail.expert.label&&articleDetail.expert.continueFocus<3)||(!articleDetail.expert.label&&articleDetail.expert.focus<10)||(articleDetail.expert.continueFocus<3&&articleDetail.expert.focus<10))&&articleDetail.expert.articleCount>0&&articleDetail.expert.focusArticleCount>0">
							<div class="rel row1">总{{articleDetail.expert.articleCount}}中{{articleDetail.expert.focusArticleCount}}</div>
						</div>
					</div>
					<div class="fsize12 co8b8b8b mb15">粉丝：{{articleDetail.expert.collect}}</div>
					<div class="fsize12 radius2 cofff wid76 lh28 bgfea830 marginauto cursor mb10" :class="[{'hascollect':articleDetail.expert.isCollect==1}]" @click="toCollect"><i class="el-icon-plus mr5" v-if="!articleDetail.expert.isCollect"></i>{{articleDetail.expert.isCollect==1?'已关注':'关注'}}</div>
					<div class="expert-fr-box left co666 fsize12 lh20">{{articleDetail.expert.intro}}</div>
				</div>

				<div class="bgfff pd22 radius4 pt20 pb20">
					<div class="f-cb">
						<div class="fl fsize18 bold">推荐解读</div>
						<div class="fr">
							<div :class="['fl ml20 cursor hover',{'bor-ric6c6c6 pr20':index==0},{'color':item.id==type}]" v-for="(item,index) in typeList" :key="index" @click="changeTab(item.id)">{{item.name}}</div>
						</div>
					</div>
					<div>
						<div v-for="(item,index) in recommendArticle"  :key="index">
							<div class="bor-boc6c6c6 block f-cb pt15 pb10 cursor" v-if="item.id!=id" @click="toDetail(item.id)">
								<div class="rel home-expert-tx fl mr10 home-expert-tx2">
									<img :src="item.expert.avatar" class="img-cover radius img1 block"/>
									<img src="../assets/img/home-ico2.png" class="abs img2"/>
								</div>
								<div class="fr home-expert-fr">
									<div class=" pt5 mb5">{{item.expert.nickName}}</div>
									<div class="row2 lh18 co999 fsize12 mb10 hover">
										{{item.title}}
									</div>
									<div class="f-cb detail-bot detail-bot1 fsize12 co999">
										<div class="fl">来自本平台<span class="color italic">推荐</span></div>
										<div class="fr color" v-if="item.price>0"><img src="../assets/img/home-ico4.png" class="fl mr10 wid20">{{item.price}}金币</div>
										<p class="fr" v-else>免费</p>
									</div>
								</div>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		</div>
		</div>

		<my-footer></my-footer>

		<!--选择优惠券-->
		<div class="back-black" v-if="showQuan">
			<div class="back-black-bg"></div>
			<div class="back-black-con pd28 wid380 pb20">
				<i class="el-icon-close  back-black-btn fsize28" @click="showQuan=false;buyShow=true;"></i>
				<div class="fsize16 pt20 mb20">选择优惠券 <div class="inline fsize12 co666 ml10">您有 <span class="color">{{quan.length}}</span> 张优惠券可使用</div></div>

				<div class="back-coupon mb20">
					<div class="back-coupon-con rel f-cb mb10" :style="{backgroundImage:'url('+require('../assets/img/home-ico7.png')+')'}" v-for="(item,index) in quan" :key="index" @click="chooseQuan(item.id,item.discount)">
						<div class="fl back-coupon-fl">
							<div class="lh30 f-cb fsize18 ">
								<div class="fl row1 wid140">{{item.name}}</div>
								<div class="fr color"><span class="fsize30 DINCond-Bold">{{item.discount}}</span>折</div>
							</div>
							<div class="co999 fsize12">有效期：{{item.startTime}} - {{item.overTime}}</div>
						</div>
						<div class="back-coupon-btn" :class="[{'on':couponId == item.id}]"><i class="el-icon-check"></i></div>
					</div>
				</div>
				<div class="fsize16 cursor cofff bgcolor wid210 lh54 center radius4 marginauto" @click="showQuan=false;buyShow=true;">购买本场</div>

			</div>
		</div>


		<!--金币购买-->
		<my-tip ctype="1" :price="price" :couponId="couponId" :articleId="id" v-if="buyShow"></my-tip>

		<!--金币不足-->
		<my-tip ctype="2" v-if="fillShow"></my-tip>

		<!--购买成功-->
		<my-tip ctype="3" v-if="successShow"></my-tip>

	</div>

</template>
<script>
import Header from "../components/header";
import Footer from "../components/footer";
import ArticleList from "../components/articleList";
import Tip from "../components/tip";

export default {
	name: 'index',
	inject:['routerRefresh'],   //在子组件中获取父或祖先里的方法
	components: {
		"my-header": Header,
		"my-footer": Footer,
		"my-articleList":ArticleList,
		"my-tip":Tip
	},
	data() {
		return {
			id:'',
			typeList: [
				{ id: 1, name: '人  气' },
				{ id: 2, name: '命中率' },
			],
			type:1,
			showQuan:false,
			buyShow:false,
			fillShow:false,
			successShow:false,

			articleDetail:null,       //解说详情
			otherList:{},             //专家其他解读数据
			recommendArticle:[],      //推荐解读
			
			couponId:'',              //券id
			couponDis:'',             //券折扣
			price:'',                 //折后价
		};
	},
	created() {
		

	},
	mounted() {
		this.id = this.$route.query.id;
		this.getDetail();
		this.Recommend();
		
	},
	computed:{
		quan(){
			return this.$store.state.userInfo.quan||[];
		}
	},
	methods: {
		//购买本场 1先判断token 2有券先选券，3选完券提示购买
		lookQuan(){
			if(!this.$store.state.userInfo.token){
				this.$store.commit('until/SET_LOGINSHOW',true);
			}else{
				//console.log(this.quan.length)
				this.quan.length>0?(this.showQuan = true):(this.buyShow = true);
			}
		},
		chooseQuan(id,dis){
			this.couponId = id;
			this.price = this.price*dis/10;
		},
		//解读文章详情
		getDetail(){
			this.$fetch('/api/expert/article_details',{id:this.id}).then(res=>{
				//console.log(res,'专家解说详情')
				if(res.data.returnCode=='0000'){
					this.articleDetail = res.data.data;
					this.price = res.data.data.price;
				}else{
					this.$message(res.data.msg)
				}
			})
		},
		changeTab(id){
			this.type = id;
			this.Recommend();
		},
		//推荐解读
		Recommend(){
			let data = {page:1,limit:6,type:this.type}
			this.$fetch('/api/common/index',data).then(res=>{
				//console.log(res,'推荐解读')
				if(res.data.returnCode=='0000'){
					this.recommendArticle = res.data.data.article.data;
				}else{
					this.$message(res.data.msg)
				}
			})
		},
		toCollect(){
			if(!this.$store.state.userInfo.token){
				this.$store.commit('until/SET_LOGINSHOW',true);
				return;
			}
			let num = Number(this.articleDetail.expert.collect);
			if(this.articleDetail.expert.isCollect == 1){
				//取消关注
				this.$fetch('/api/expert/collect_expert',{id:this.articleDetail.expert.id,type:2}).then(res=>{
					//console.log(res,'取消关注')
					if(res.data.returnCode == '0000'){
						this.$message({message:'取关成功',type:'success'})
						this.articleDetail.expert.isCollect = 0;
						this.articleDetail.expert.collect = num-1; 
					}
				})
			}else{
				//关注
				this.$fetch('/api/expert/collect_expert',{id:this.articleDetail.expert.id,type:1}).then(res=>{
					//console.log(res,'关注')
					if(res.data.returnCode == '0000'){
						this.$message({message:'收藏成功',type:'success'})
						this.articleDetail.expert.isCollect = 1;
						this.articleDetail.expert.collect = num+1;
					}
				})
			}
		},
		//其他解读-正在推荐2
		changePage(page,limit){
			//console.log(page,limit,'1')
			this.getOtherList(2,page,limit);
			
		},
		getOtherList(type,page,limit){
			this.$fetch('/api/expert/expert_detail_article',{id:this.articleDetail.expert.id,type,page,limit}).then(res=>{
				//console.log(res,'其他解读')
				if(res.data.returnCode=='0000'){
					let data = res.data.data;
					//this.otherList = res.data.data;
					//去除当前解说
					for(let i=0;i<data.data.length;i++){
						if(data.data[i].id == this.id){
							data.data.splice(i,1);
						}
					}
					this.otherList = data;
				}else{
					this.$message(res.data.msg)
				}
			})
		},
		toDetail(id){
			this.$router.push({path:'/expertArticle',query:{id}})
			this.routerRefresh();
		}
	}
};

</script>

<style lang="scss">
	@import '../assets/css/index';
	body{
		background: $bodyBg;
	}
	.hascollect{
		background:#cecece;
		color:#666;
	}
</style>
