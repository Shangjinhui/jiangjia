<template>
	<div>
		<!-- <div class="fb fsize16 center lh46 home-lable mb10 bold">
			<div class="item-flex-1 cursor" :class="[{'on':item.id==type}]" v-for="item in typeList" @click="changeTab(item.id)">{{item.name}}</div>
		</div> -->
		<div class="flex-sp-top">
			<div class="cl">
				<div v-for="(item,index) in list"  :key="index" >
					<div class="bgf5f5f5 radius4 home-expert-details hover cursor" v-if="index%2==0" @click="toDetail(item.id,index)">
						<div class="f-cb mb15 co333">
							<div class="rel home-expert-tx fl mr10">
								<img :src="item.expert.avatar" class="img-cover radius img1 block"/>
								<img src="../assets/img/home-ico2.png" class="abs img2"/>
							</div>
							<div class="fl pt15">
								<div class="fsize16 bold mb5">{{item.expert.nickName}}</div>
								<div class="fsize12 co8b8b8b">{{item.createTime|removeYearSecond}}</div>
							</div>
							<div class="fr pt15">
								<!-- <div class="home-hot-tx rel fl ml5" v-if="item.expert.label">
									<div class="rel row1">{{item.expert.label}}</div>
								</div>
								<div v-else>
									<div class="home-hot-tx rel fl ml5" v-if="item.expert.continueFocus>=3">
										<div class="rel row1">{{item.expert.continueFocus}}连红</div>
									</div>
									<div class="home-hot-tx rel fl ml5" v-if="item.expert.focus>=10">
										<div class="rel row1">近20中{{item.expert.focus}}</div>
									</div>
									<div class="home-hot-tx rel fl ml5" v-if="(item.expert.continueFocus<3||item.expert.focus<10)&&item.expert.articleCount>0&&item.expert.focusArticleCount>0">
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
						<div class="row2 lh20 mb15">
							<span class="fsize12 cofff bgcolor inline pd5 mr5" v-if="item.notPointRefund==1">不中退金币</span>{{item.title}}
						</div>
						<div class="bgfff detail-box radius4 mb10 co333" v-for="(item2,index2) in item.detail" :key="index2">
							<div class="coffc61a mb10">{{item2.match_name}} <span class="fsize12 co8b8b8b ml10">开赛：{{item2.match_time|removeYearSecond}}</span></div>
							<div>{{item2.home}} <span class="ml10 mr10 co8b8b8b">VS</span>{{item2.away}}</div>
						</div>
						<div class="f-cb detail-bot co8b8b8b">
							<div class="fl fsize12 line rel">足球</div>
							<div class="fl fsize12"><img src="../assets/img/home-ico3.png" class="fl">{{item.jSaleCount}}</div>
							<div class="fr color" v-if="item.price>0"><img src="../assets/img/home-ico4.png" class="fl mr10">{{item.price}}金币</div>
							<p v-else class="fr">免费</p>
						</div>
					</div>
				</div>				
			</div>
			<div class="cr">
				<div v-for="(item,index) in list"  :key="index" >
					<div class="bgf5f5f5 radius4 home-expert-details hover cursor" v-if="index%2==1" @click="toDetail(item.id,index)">
						<div class="f-cb mb15 co333">
							<div class="rel home-expert-tx fl mr10">
								<img :src="item.expert.avatar" class="img-cover radius img1 block"/>
								<img src="../assets/img/home-ico2.png" class="abs img2"/>
							</div>
							<div class="fl pt15">
								<div class="fsize16 bold mb5">{{item.expert.nickName}}</div>
								<div class="fsize12 co8b8b8b">{{item.createTime|removeYearSecond}}</div>
							</div>
							<div class="fr pt15">
								<!-- <div class="home-hot-tx rel fl ml5" v-if="item.expert.label">
									<div class="rel row1">{{item.expert.label}}</div>
								</div>
								<div v-else>
									<div class="home-hot-tx rel fl ml5" v-if="item.expert.continueFocus>=3">
										<div class="rel row1">{{item.expert.continueFocus}}连红</div>
									</div>
									<div class="home-hot-tx rel fl ml5" v-if="item.expert.focus>=10">
										<div class="rel row1">近20中{{item.expert.focus}}</div>
									</div>
									<div class="home-hot-tx rel fl ml5" v-if="(item.expert.continueFocus<3||item.expert.focus<10)&&item.expert.articleCount>0&&item.expert.focusArticleCount>0">
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
						<div class="row2 lh20 mb15">
							<span class="fsize12 cofff bgcolor inline pd5 mr5" v-if="item.notPointRefund==1">不中退金币</span>{{item.title}}
						</div>
						<div class="bgfff detail-box radius4 mb10 co333" v-for="(item2,index2) in item.detail" :key="index2">
							<div class="coffc61a mb10">{{item2.match_name}} <span class="fsize12 co8b8b8b ml10">开赛：{{item2.match_time|removeYearSecond}}</span></div>
							<div>{{item2.home}} <span class="ml10 mr10 co8b8b8b">VS</span>{{item2.away}}</div>
						</div>
						<div class="f-cb detail-bot co8b8b8b">
							<div class="fl fsize12 line rel">足球</div>
							<div class="fl fsize12"><img src="../assets/img/home-ico3.png" class="fl">{{item.jSaleCount}}</div>
							<div class="fr color" v-if="item.price>0"><img src="../assets/img/home-ico4.png" class="fl mr10">{{item.price}}金币</div>
							<p v-else class="fr">免费</p>
						</div>
					</div>
				</div>	
			</div>
		</div>
		<no-data v-if="list.length==0"></no-data>

		<!-- -------------- -->
		<!-- <div class="f-cb">
			<div class="fl bgf5f5f5 radius4 home-expert-detail hover cursor" v-for="(item,index) in list"  :key="index" @click="toDetail(item.id,index)">
				<div class="f-cb mb15 co333">
					<div class="rel home-expert-tx fl mr10">
						<img :src="item.expert.avatar" class="img-cover radius img1 block"/>
						<img src="../assets/img/home-ico2.png" class="abs img2"/>
					</div>
					<div class="fl pt15">
						<div class="fsize16 bold mb5">{{item.expert.nickName}}</div>
						<div class="fsize12 co8b8b8b">{{item.createTime|removeYearSecond}}</div>
					</div>
					<div class="fr pt15">
						<div class="home-hot-tx rel fl ml5" v-if="item.expert.label">
							<div class="rel row1">{{item.expert.label}}</div>
						</div>
						<div v-else>
							<div class="home-hot-tx rel fl ml5" v-if="item.expert.continueFocus>=3">
								<div class="rel row1">{{item.expert.continueFocus}}连红</div>
							</div>
							<div class="home-hot-tx rel fl ml5" v-if="item.expert.focus>=10">
								<div class="rel row1">近20中{{item.expert.focus}}</div>
							</div>
							<div class="home-hot-tx rel fl ml5" v-if="(item.expert.continueFocus<3||item.expert.focus<10)&&item.expert.articleCount>0&&item.expert.focusArticleCount>0">
								<div class="rel row1">总{{item.expert.articleCount}}中{{item.expert.focusArticleCount}}</div>
							</div>
						</div>
						
					</div>

				</div>

				<div class="row2 lh20 hei40 mb15">
					<span class="fsize12 cofff bgcolor inline pd5 mr5" v-if="item.notPointRefund==1">不中退金币</span>{{item.title}}
				</div>

				<div class="bgfff detail-box radius4 mb10 co333" v-for="(item2,index2) in item.detail" :key="index2">
					<div class="coffc61a mb10">{{item2.match_name}} <span class="fsize12 co8b8b8b ml10">{{item2.match_time|removeYearSecond}}</span></div>
					<div>{{item2.home}} <span class="ml10 mr10 co8b8b8b">VS</span>{{item2.away}}</div>
				</div>

				<div class="f-cb detail-bot co8b8b8b">
					<div class="fl fsize12 line rel">足球</div>
					<div class="fl fsize12"><img src="../assets/img/home-ico3.png" class="fl">{{item.jSaleCount}}</div>
					<div class="fr color" v-if="item.price>0"><img src="../assets/img/home-ico4.png" class="fl mr10">{{item.price}}金币</div>
					<p v-else class="fr">免费</p>
				</div>

			</div>

			<no-data v-if="list.length==0"></no-data>
		</div> -->
	</div>
	
</template>

<script>
import noData from '@/components/noData'
export default {
	components:{noData},
	props:{
		list:{
			type:Array,
			default:()=>[]
		}
	},
	data(){
		return {

		}
	},
	computed:{
		
	},
	
	created(){},
	watch:{

	},
	mounted(){
		
	},
	methods:{
		toDetail(id,index){
			const num = Number(this.list[index].jSaleCount);
			this.list[index].jSaleCount = num+1;
			this.$router.push({ name: 'expertArticle',query:{id}});
		}
	},
}
</script>
<style lang="scss">

.cl,.cr{
	width:570px;
	.home-expert-details{
		width: 570px;
		padding: 20px 22px 15px 22px;
		margin-bottom: 15px;
		.detail-box{
			padding: 10px 22px;
		}
	}
}
</style>

