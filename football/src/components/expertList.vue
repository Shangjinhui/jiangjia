<template>
	<div class="f-cb">
		<div class="rel expert-list " :class="[{'expert-list1 wid360':ctype==2}]" v-for="(item,index) in list" :key="index">
			<router-link :to="{name:'expertDetail',query:{id:item.id}}">
				<img src="../assets/img/ex-ico1.png" class="abs ico" v-if="index==0">
				<img src="../assets/img/ex-ico2.png" class="abs ico" v-else-if="index==1">
				<img src="../assets/img/ex-ico3.png" class="abs ico" v-else-if="index==2">
				<div class="abs ico fsize18 DINCond-Bold co999" v-else>{{index+1}}</div>
				<div class="bor-boc6c6c6 f-cb ">
					<div class="rel home-expert-tx fl mr10">
						<img :src="item.avatar" class="img-cover radius img1 block"/>
						<img src="../assets/img/home-ico2.png" class="abs img2"/>
					</div>
					<div class="fr  expert-list-fr">
						<div class="f-cb fsize12 mb5">
							<div class="fl fsize14 bold lh18 row1 maxwid100">{{item.nickName}}</div>
							<div class="fl ">
								<!-- <div class="home-hot-tx rel fl ml5" v-if="item.label">
									<div class="rel row1">{{item.label}}</div>
								</div>
								<div v-else>
									<div class="home-hot-tx rel fl ml5" v-if="item.continueFocus>=3">
										<div class="rel row1">{{item.continueFocus}}连红</div>
									</div>
									<div class="home-hot-tx rel fl ml5" v-if="item.focus>=10">
										<div class="rel row1">近20中{{item.focus}}</div>
									</div>
									<div class="home-hot-tx rel fl ml5" v-if="(item.continueFocus<3||item.focus<10)&&item.articleCount>0&&item.focusArticleCount>0">
										<div class="rel row1">总{{item.articleCount}}中{{item.focusArticleCount}}</div>
									</div>
								</div> -->
								<div class="home-hot-tx rel fl ml5" v-if="item.label">
									<div class="rel row1">{{item.label}}</div>
								</div>
								<div class="home-hot-tx rel fl ml5" v-if="item.continueFocus>=3">
									<div class="rel row1">{{item.continueFocus}}连红</div>
								</div>
								<div class="home-hot-tx rel fl ml5" v-if="(!item.label||item.continueFocus<3)&&item.focus>=10">
									<div class="rel row1">近20中{{item.focus}}</div>
								</div>
								<div class="home-hot-tx rel fl ml5" v-if="((!item.label&&item.continueFocus<3)||(!item.label&&item.focus<10)||(item.continueFocus<3&&item.focus<10))&&item.articleCount>0&&item.focusArticleCount>0">
									<div class="rel row1">总{{item.articleCount}}中{{item.focusArticleCount}}</div>
								</div>
							</div>

						</div>
						<div class="row2 fsize12 co999 lh18 hei36">{{item.intro}}</div>
					</div>
				</div>
			</router-link>
			<div @click="toCollect(item.isCollect,item.id,index)">
				<i class="fr el-icon-check abs" v-if="item.isCollect"></i>
				<i class="fr el-icon-plus abs" v-else></i>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	components:{},
	props:{
		list: {
			type: Array,
			// default: function () { return [] }
			default: () => []
		},
		ctype:{               //2无侧边排序
			type:String,
			default:'1',
		}
	},
	data(){
		return {
		}
	},
	computed:{

	},
	methods:{
		toCollect(o,id,index){
			if(o == 1){
				//取消关注
				this.$fetch('/api/expert/collect_expert',{id,type:2}).then(res=>{
					//console.log(res,'取消关注')
					if(res.data.returnCode == '0000'){
						this.$message({message:'取关成功',type:'success'})
						this.list[index].isCollect = 0;
					}
				})
			}else{
				//关注
				this.$fetch('/api/expert/collect_expert',{id,type:1}).then(res=>{
					//console.log(res,'关注')
					if(res.data.returnCode == '0000'){
						this.$message({message:'收藏成功',type:'success'})
						this.list[index].isCollect = 1;
					}
				})
			}
		}
	},
	created(){},
	watch:{

	},
	mounted(){
		//console.log(this.list)
	}
}
</script>
