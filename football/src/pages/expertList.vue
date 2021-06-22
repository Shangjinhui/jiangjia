<template>
	<div class="pt80">
		<my-header nav="4"></my-header>

		<div class="wid1200 marginauto  pb50 ">
			<div class=" bgfff pda20 minhei580">
				<div class="f-cb">
					<my-expertList ctype="2"></my-expertList>
				</div>


			</div>
		</div>

		<my-footer></my-footer>



	</div>

</template>
<script>
import Header from "../components/header";
import Footer from "../components/footer";
import ExpertList from "../components/expertList.vue";

export default {
	name: 'index',
	components: {
		"my-header": Header,
		"my-footer": Footer,
		"my-expertList": ExpertList,

	},
	data() {
		return {
			typeList: [
				{ id: 1, name: '人  气' },
				{ id: 2, name: '命中率' },
			],
			type:1,
			buyShow:false,
			fillShow:false,
			successShow:false,

		};
	},
	created() {


	},
	mounted() {

	},
	methods: {

		getList(){
			const _this = this;

			this.getData('goods/program','get','').then(res=>{
				if(res.data.returnCode=='0000'){
					const data=res.data.data;
					_this.list=data.goods_program_list;
					_this.bannerList=data.banner;
					_this.articleList=data.article_list;
					_this.aboutImg=data.about.photo;
					_this.onLoad=true;
				}else{
					this.$toast(res.data.data.msg)
				}
			})
		},
	}
};

</script>

<style lang="scss">
	@import '../assets/css/index';
	body{
		background: $bodyBg;
	}
</style>
