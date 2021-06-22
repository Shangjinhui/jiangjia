<template>
	<div class="back-black back-black-show">
		<div class="back-black-bg"></div>
		<div class="back-black-con pd28 wid380 pb30">
			<i class="el-icon-close  back-black-btn fsize28" @click="close"></i>
			<div class="fsize16 pt20 mb25 center bor-boc6c6c6 pb15">温馨提示</div>

			<div class="center pt5 mb20" v-if="ctype==1">您确定花费<span class="color">{{price}}</span>金币购买本场推荐吗？</div>

			<div class="center pt5 mb20" v-if="ctype==2">您的金币不足，请充值！</div>

			<div v-if="ctype==3" class="center mb20">
				<img src="../assets/img/home-ico8.png" class="mb20">
				<div class="line26">恭喜你购买成功！</div>
			</div>

			<div v-if="ctype==4" class="center mb20">
				<img src="../assets/img/home-ico8.png" class="mb20">
				<div class="line26">恭喜你已成功充值<span class="color">xx</span>金币,赶快购买<br/>文章查看吧！</div>
			</div>

			<div class="center fsize12">
				<div class="tip-btn on " v-if="ctype==1" @click="toBuy">确定</div>
				<router-link :to="{ path: '/selfCenter'}" class="tip-btn on " v-if="ctype==2">立即充值</router-link>
				<div class="tip-btn  " v-if="ctype==1||ctype==2" @click="close">取消</div>
				<div class="tip-btn  " v-if="ctype==3" @click="routerRefresh">立即查看</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	inject:['routerRefresh'],   //在子组件中获取父或祖先里的方法
	components:{},
	props:{
		ctype:{
			type:String,
			default:'1', //1金币购买  2金币不足  3购买成功 4个人中心金币充值成功
		},
		couponId:{       //优惠券id
			type:String,
			default:''
		},
		price:{         //价格
			type:String|Number,
			default:'0'
		},
		articleId:{          //解读文章id
			type:String,
			default:''
		}
	},
	data(){
		return {
		}
	},
	created(){

	},
	computed:{

	},
	methods:{
		close(){
			this.$parent.buyShow = false;
			this.$parent.fillShow = false;
			if(this.ctype == 3) this.routerRefresh();;
		},
		toBuy(){
			let yue = this.$store.state.userInfo.userInfo.balance;
			//console.log(Number(yue))
			if(Number(yue)<this.price){
				this.$parent.buyShow = false;
				this.$parent.fillShow = true;
				return;
			}
			let data = {
				id:this.articleId,
				type:1,
			}
			if(this.couponId) data.coupon = this.couponId;
			this.$fetch('/api/expert/direct_article_pay',data,'POST').then(res=>{
				if(res.data.returnCode=='0000'){
					//购买成功
					this.$parent.buyShow = false;
					this.$parent.successShow = true;
					//重置优惠券
					if(this.couponId) this.$store.dispatch('userInfo/getQuan');
				}else if(res.data.returnCode=='0030'){
					//金币不足
					this.$parent.buyShow = false;
					this.$parent.fillShow = true;
				}else{
					this.$message(res.data.msg);
					this.$parent.buyShow = false;
					this.$parent.fillShow = false;
				}
			})
		}
	},
}
</script>
<style lang="scss">
	@import '../assets/css/color';

	img{display:inline-block;}
	.line26{line-height:26px;}
	.tip-btn{
		width: 70px;
		line-height:26px;
		border:1px solid #bfbfbf;
		display: inline-block;
		margin: 0px 4px;
		cursor: pointer;
		
		&.on,&:hover{
			border-color: $color;
			background: $color;
			color: #fff;
		}
		
	}
</style>
