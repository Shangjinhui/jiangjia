<template>
	<div class=" footer">
		<div class="wid1200 marginauto center">
			<ul class=" footer-top mb10">
				<li>深圳匠佳科技有限公司</li>
				<li><router-link :to="{ name: 'footerText',query:{id:1}}">关于进球哨</router-link></li>
				<li><router-link :to="{ name: 'footerText',query:{id:2}}">免责申明</router-link></li>
				<li><router-link :to="{ name: 'footerText',query:{id:3}}">联系方式</router-link></li>
			</ul>
			<ul class="footer-cen mb20 fsize12">
				<!-- <li>增值电信业务经营许可证：深12239223020</li> -->
				<!-- <li>深ICP备182032号-1</li> -->
				<li><a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备19074291号</a></li>
				<li><img src="../assets/img/fot_ico1.png" class="mr10 vertical-4">深公网安备 3102832930号</li>
			</ul>
			<div class="footer-cen fsize12">
				<img src="../assets/img/fot_ico2.jpg" class="mb10 wid80">
				<div class="">扫码关注公众号</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components:{},
	props:{

	},
	data(){
		return {

		}
	},
	computed:{

	},
	methods:{

	},
	created(){},
	mounted(){}
}
</script>

<style lang="scss">
@import '../assets/css/color';
.footer{
	background: #2c2c2c;
	padding: 30px 0 40px 0;
	img{display:inline-block;}
	li{
		display: inline-block;
		padding: 0px 15px;
		border-right: 1px solid rgba(255, 255, 255, 0.2);

		&:last-child{
			border-right: none;
		}
	}

	.footer-top{
		li,a{
			color: #fff;
			-webkit-transition: 0.3s linear; -moz-transition: 0.3s linear; -ms-transition: 0.3s linear; -o-transition: 0.3s linear; transition: 0.3s linear;
		}
		a{
			&:hover{
				color: $color;
			}
		}
	}
	.footer-cen{
		color: rgba(255, 255, 255, 0.5);
		a{
			color: rgba(255, 255, 255, 0.5);
		}
	}
}
</style>