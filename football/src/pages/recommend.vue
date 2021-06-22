<template>
	<div class="pt80">
		<my-header nav="2"></my-header>

		<div class="wid1200 marginauto mh850">

			<!--热门推荐-->
			<div class="bgfff  mb50 radius6">
				<div class="fsize18 bold pt20 pb20 pd15">热门推荐</div>

				<div class="pd22 pb50">


					<div class="fb fsize16 center lh46 home-lable mb10 bold">
						<div class="item-flex-1 cursor " :class="[{'on':item.id==type},{'bor-ric6c6c6 bore8e8e8':index<typeList.length-1}]" v-for="(item,index) in typeList" @click="changeTab(item.id)" :key="index">{{item.name}}</div>
					</div>


					<!--解说列表-->
					<my-explain :list="list"></my-explain>

					<p class="center mt20 color cursor" v-if="list.length<total" @click="loadMore">查看更多优质解读 ></p>
				</div>

			</div>
		</div>


		<my-footer></my-footer>

	</div>

</template>
<script>
import Header from "../components/header";
import Explain from "../components/explain";
import Footer from "../components/footer";

export default {
	name: 'index',
	components: {
		"my-header": Header,
		"my-explain": Explain,
		"my-footer": Footer,
	},
	data() {
		return {
			bannerList:[],
			typeList: [
				{ id: 1, name: '人气榜' },
				{ id: 2, name: '命中榜' },
				{ id: 3, name: '连红榜' },
			],
			type:1,
			page:1,
			limit:6,
			total:0,
			list:[],
		};
	},
	created() {


	},
	mounted() {
		this.getList();
	},
	methods: {
		changeTab(id){
			if(id == this.type) return;
			this.type = id;
			this.page = 1;
			this.list = [];
			this.getList();
		},
		getList(){
			let data = {page:this.page,limit:this.limit,type:this.type}
			this.$fetch('/api/expert/expert_index',data).then(res=>{
				//console.log(res,'精选推荐')
				if(res.data.returnCode=='0000'){
					let result = res.data.data;
					let list = [...this.list,...result.article.data];
					this.total = result.article.count;
					this.list = list;
				}else{
					this.$message(res.data.msg)
				}
			})
		},
		loadMore(){
			if(this.list.length>=this.total) return;
			this.page++;
			this.getList();
		},
	}
};

</script>

<style lang="scss">
	@import '../assets/css/color';
	@import '../assets/css/index';

	body{
		background: $bodyBg;
	}
</style>
