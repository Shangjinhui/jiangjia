<template>
	<div class="banner rel ovh mb10">
		<div class="f-cb banner-inner" :style="'width:'+(banner.length*119+732) + 'px;left:'+(bannerNum>3?(-119*(bannerNum-3)):0)+'px'">
			<div class="fl rel banner-con cursor" :class="[{on:bannerNum==index}]" v-for="(item,index) in banner" :key="index" @mouseenter="mouseEnter(index)" @mouseleave="mouseLeave" @click="toDetail(item.id,item.link,item.type)">
				<img :src="item.photo" class="block">
				<!-- <div class="abs text">
					<div class="row1">{{item.name}}</div>
					<div class="" v-if="bannerNum!=index">...</div>
				</div> -->
			</div>
		</div>
		<div class="banner-fl abs" :style="bannerNum===0?{backgroundColor:'rgba(0,0,0,.1)'}:null" @click="prev"></div>
		<div class="banner-fr abs" @click="next"></div>

	</div>
</template>

<script>
export default {
	components:{},
	props:{
		banner: {
			type: Array,
			// default: function () { return [] }
			default: () => []
		},
		autoplay:{
			type:Boolean,
			default:true
		},
		delay:{
			type:Number,
			default:5000
		}
	},
	data(){
		return {
			bannerNum:1,
			timer:null,
		}
	},
	mounted(){
		if(this.autoplay) this.createSwiper();
	},
	computed:{

	},
	methods:{
		createSwiper(){
			this.timer = setInterval(()=>{
				this.next();
			},this.delay)
		},
		prev(){
			if(this.bannerNum!==0) this.bannerNum--;
		},
		next(){
			if(this.bannerNum!==this.banner.length-1){
				this.bannerNum++;
			}else{
				this.bannerNum = 0;
			}
		},
		mouseEnter(ind){
			this.bannerNum = ind;
			clearInterval(this.timer);
		},
		mouseLeave(){
			this.createSwiper();
		},
		toDetail(id,link,type){
			//console.log(id,type,link)
			//type 1外链2解说3编辑器（需请求接口获取古文本）4比赛5直播--------pc端没有比赛详情，直播
			switch(Number(type)){
				case 1:
					window.open(link);
					break;
				case 2:
					this.$router.push({path:'/expertArticle',query:{id:link}});
					break;
				case 3:
					this.$router.push({path:'/editPage',query:{text:encodeURI(link)}});
					break;
			}
			
		}
	},
	created(){},
	watch:{

	},
}
</script>

<style lang="scss">
	@import '../assets/css/color';
	.banner{background-color:#fff;}
	.banner-inner{
		position:relative;
		left:0;
		transition:left .8s ease;
	}
	.banner-con{
		width: 114px;
		height:422px;
		margin-right: 5px;
		border-radius: 5px;
		overflow: hidden;
		transition:width .8s ease;
		.text{
			color: #ffffff;
			left:0;
			width: 100%;
			padding: 0px 14px 20px 14px;
			bottom:0;

		}
		&:before{
			position: absolute;
			content: '';
			left:0;
			top:0;
			width: 100%;
			height:100%;
			background: rgba(0, 0, 0, 0.5);
		}
		img{
			width:846px ;
			height:422px;
			object-fit: cover;
		}
		&.on{
			width:846px ;
			.text{
				font-size: 18px;
				padding: 0px 120px 20px 17px;
			}
			&:before{
				display: none;
			}
		}

	}
	.banner-fl,.banner-fr{
		width: 24px;
		height:67px;
		background: rgba(0, 0, 0, 0.5) url("../assets/img/ban-fl.png") no-repeat center;
		top:50%;
		transform: translateY(-50%);
		cursor: pointer;
	}
	.banner-fl{
		left:0;
	}
	.banner-fr{
		right:0;
		background-image: url("../assets/img/ban-fr.png");
	}


</style>