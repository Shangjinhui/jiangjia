<template>
	<div class="pt80">
		<my-header nav="4"></my-header>

		<div class="wid1200 marginauto pb50 mh850">
			<div class=" bgfff pda20">
				<div class="f-cb">
					<div class="fl wid360 mr40">
						<div class="expert-top">人气榜</div>
						<my-expertList :list="list1page"></my-expertList>
					</div>
					<div class="fl wid360 mr40">
						<div class="expert-top orange">命中榜</div>
						<my-expertList :list="list2page"></my-expertList>
					</div>
					<div class="fl wid360">
						<div class="expert-top blue">连红榜</div>
						<my-expertList :list="list3page"></my-expertList>
					</div>
				</div>
				<no-data v-if="list1page.length==0&&list2page.length==0&&list3page.length==0"></no-data>
				<div class="center mt20" v-if="page*limit<total"><p class="color cursor" @click="lookMore">查看更多专家 ></p></div>

			</div>
		</div>

		<my-footer></my-footer>



	</div>

</template>
<script>
import Header from "../components/header";
import Footer from "../components/footer";
import ExpertList from "../components/expertList.vue";
import noData from '@/components/noData'
export default {
	name: 'index',
	components: {
		"my-header": Header,
		"my-footer": Footer,
		"my-expertList": ExpertList,
		noData
	},
	data() {
		return {
			// typeList: [
			// 	{ id: 1, name: '人气榜' },
			// 	{ id: 2, name: '命中榜' },
			// 	{ id: 3, name: '连红榜' },
			// ],
			// type:1,
			// buyShow:false,
			// fillShow:false,
			// successShow:false,
			page:1,
			limit:9,
			list1:[],
			list2:[],
			list3:[],
			list1page:[],
			list2page:[],
			list3page:[],
			total:0,
		};
	},
	created() {


	},
	mounted() {
		this.getCon();
	},
	filters:{
		cutPage(data){
			return data.splice(0,this.page*this.limit);
		}
	},
	methods: {
		getCon(){
			let res1 = this.$fetch('/api/expert/expert_lists',{type:1},'GET',false);
			let res2 = this.$fetch('/api/expert/expert_lists',{type:2},'GET',false);
			let res3 = this.$fetch('/api/expert/expert_lists',{type:3},'GET',false);
			//console.log(res1,res2,res3)
			const load = this.$myloading();
			Promise.all([res1,res2,res3]).then(res=>{
				load.close();
				this.total = Math.max(res[0].data.data.count,res[1].data.data.count,res[2].data.data.count);
				res[0].data.returnCode=='0000'?this.list1 = res[0].data.data.data:this.$message(res.data.msg);
				res[1].data.returnCode=='0000'?this.list2 = res[1].data.data.data:this.$message(res.data.msg);
				res[2].data.returnCode=='0000'?this.list3 = res[2].data.data.data:this.$message(res.data.msg);
				this.cutPage();
			}).catch(err=>{
				//可能会超时
				load.close();
			})
		},
		lookMore(){
			//console.log(this.total)
			const total = this.total;
			// if(this.list1.length>=total&&this.list2.length>=total&&this.list3.length>=total) return;
			// this.page++;
			// this.getCon();
			if(this.page*this.limit>=this.total) return;
			this.page++;
			this.cutPage();
		},
		cutPage(){
			this.list1page = this.list1.slice(0,this.page*this.limit);
			this.list2page = this.list2.slice(0,this.page*this.limit);
			this.list3page = this.list3.slice(0,this.page*this.limit);
		}
		
	}
};

</script>

<style lang="scss">
	@import '../assets/css/index';
	body{
		background: $bodyBg;
	}
</style>
