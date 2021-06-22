<template>
	<div class="bgfff header">
		<div class="wid1200 marginauto f-cb">
			<img src="../assets/img/logo.png" class="fl mr15">
			<img src="../assets/img/logo1.png" class="fl mt20">
			<!-- 头部导航 -->
			<div class="fl header-nav">
				<div class="fl header-nav-con rel tra" @click="goList(item)" :class="[{on:nav==item.id}]" v-for="(item,index) in navList" :key="index">{{item.name}}</div>
			</div>
			<!-- <router-link class="self fr flex cursor" v-if="userInfo" :to="{path:'/selfCenter',query:{ind:4}}">
				<img class="avatar" :src="userInfo.avatar" alt="">
				<p class="username">{{userInfo.nickName}}</p>
				<img class="icon" src="@/assets/img/down.png" alt="">
			</router-link> -->
			<el-dropdown class="fr" v-if="userInfo">
				<div class="el-dropdown-link self flex cursor">
					<img class="avatar" :src="userInfo.avatar" alt="">
					<p class="username">{{userInfo.nickName}}</p>
					<img class="icon" src="@/assets/img/down.png" alt="">
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item icon="el-icon-user"><router-link :to="{path:'/selfCenter',query:{ind:4}}">个人中心</router-link></el-dropdown-item>
					<el-dropdown-item icon="el-icon-sort"><span @click="signOut">退出登录</span></el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="fr" v-else>
				<div class="fl cursor center fsize12 cofff header-login mr5 tra" @click="openLogin">登录</div>
				<div class="fl cursor center co666 header-login header-login1 tra" @click="openLogin">注册</div>
			</div>
		</div>

		<!-- 登录注册弹框 -->
		<div class="mask" v-if="loginShow">
			<div class="login-out">
				<div class="close cursor" @click="closeLogin"></div>
				<p class="h2">登录</p>
				<div class="input flex">
					<img class="icon" src="@/assets/img/phone.png" alt="">
					<!-- <el-input class="flex-son" type="number" placeholder="请输入你的手机号" value=""></el-input> -->
					<input class="flex-son" type="number" placeholder="请输入你的手机号" v-model="phone" />
				</div>
				<div class="code flex-sp">
					<div class="input flex">
						<img class="icon" src="@/assets/img/password.png" alt="">
						<input class="flex-son" type="number" placeholder="请输入验证码" v-model="code" />
					</div>
					<div class="btn-code cursor" @click="getCode">{{delay}}</div>
				</div>
				<div class="confirm cursor" @click="toLogin">立即登录</div>
				<p class="tip">其他登录方式</p>
				<img class="weixin cursor" src="@/assets/img/weixin.png" alt="" @click="wxLogin">
			</div>
		</div>
		<!-- 绑定手机号弹窗 -->
		<div class="mask" v-if="phoneShow">
			<div class="bind-out">
				<div class="close cursor" @click="phoneShow = false"></div>
				<p class="h2">绑定手机号</p>
				<div class="input flex">
					<img class="icon" src="@/assets/img/phone.png" alt="">
					<!-- <el-input class="flex-son" type="number" placeholder="请输入你的手机号" value=""></el-input> -->
					<input class="flex-son" type="number" placeholder="请输入你的手机号" v-model="phoneBind" />
				</div>
				<div class="confirm cursor" @click="confirmBind">确定</div>
				<p class="tip color">需要绑定手机号哦</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components:{},
	props:{
		nav:{
			type:String,
			default:''
		}
	},
	data(){
		return {
			phoneShow:false,
			navList:[
				{id:1,name:'首页',url:'index'},
				{id:2,name:'精选推荐',url:'recommend'},
				{id:3,name:'赛事',url:'match'},
				{id:4,name:'专家',url:'expert'},
				{id:5,name:'APP下载',url:'appDownload'},
			],
			delay:'获取验证码',
			phone:'',
			code:'',

			phoneBind:'',         //绑定的手机号
			unionId:'',          //微信登录的unionId
		}
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo.userInfo
		},
		loginShow(){
			return this.$store.state.until.loginShow
		}
	},
	watch:{
		// userInfo(val,oldval){
		// 	console.log(val,oldval,'--------')
		// }
	},
	created(){},
	mounted(){
		this.getToken();
	},
	methods:{
		goList:function ( item )
		{
			// if(item.id!=3){
			// 	//关闭赛事中的定时器
			// 	clearTimeout(this.$parent.timer)
			// }
			if(item.url){
				this.$router.push({name:item.url})
			}
		},
		getCode(){
			if(!(/^1[34578]\d{9}$/.test(this.phone))){
				this.$message('请输入正确手机号！');
				return;
			}
			if(this.delay === '获取验证码'){
				let num = 60
				this.delay = num+'s';
				let timer = setInterval(()=>{
					num--;
					if(num === 0){
						this.delay = '获取验证码';
						clearInterval(timer);
					}else{
						this.delay = num+'s';
					}
				},1000)
				let data = {
					type:1,
					phone:this.phone
				}
				this.$fetch('/api/member/send_sms',data,'POST').then(res=>{
					//console.log(res,'验证码')
					if(res.data.returnCode != '0000'){
						this.$message(res.data.msg)
					}
				})
			}
		},
		openLogin(){this.$store.commit('until/SET_LOGINSHOW',true);},
		closeLogin(){this.$store.commit('until/SET_LOGINSHOW',false);},
		toLogin(){
			if(!(/^1[34578]\d{9}$/.test(this.phone))){
				this.$message('请输入正确手机号！')
			}else if(!this.code){
				this.$message('请输入验证码！')
			}else{
				let data = {
					phone:this.phone,
					smsCode:this.code
				}
				this.$fetch('/api/member/phone_login',data,'POST').then(res=>{
					//console.log(res,'注册登录')
					if(res.data.returnCode == '0000'){
						this.$message({message:res.data.msg,type:'success'})
						
						//缓存token和用户信息
						this.$store.commit('userInfo/SET_TOKEN',res.data.data.token);
						this.$store.dispatch('userInfo/getUserInfo')

						this.$store.commit('until/SET_LOGINSHOW',false);
					}else{
						this.$message(res.data.msg)
					}
				})
			}
		},
		signOut(){
			this.$store.commit('userInfo/SET_TOKEN','');
			this.$store.commit('userInfo/SET_USERINFO',null);
		},
		wxLogin(){
			let appId = 'wxcaac082b1a124f77'	//公众号平台提供的appId
			let redirectURI = window.location.href	//扫码后回调地址
			window.location.href =
				'https://open.weixin.qq.com/connect/qrconnect?appid=' +
				appId +
				'&redirect_uri=' +
				encodeURIComponent(redirectURI) +
				'&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
		},
		getToken(){
			//微信登录扫码后截取路径上的code
			let params = window.location.href.split('code=');
			if(params.length>1){
				let code = params[params.length-1].split('&')[0];
				this.$fetch('/api/member/wechat',{code},'POST').then(res=>{
					if(res.data.returnCode == '0012'){
						//未绑定手机号，去绑定
						this.phoneShow = true;
						this.unionId = res.data.data.unionId;
					}else if(res.data.returnCode == '0000'){
						this.$message({message:res.data.msg,type:'success'})
						//登陆成功
						this.$store.commit('userInfo/SET_TOKEN',res.data.data.token);
						this.$store.dispatch('userInfo/getUserInfo')
					}
				})
			}
		},
		confirmBind(){
			//确认绑定手机号
			if(!(/^1[34578]\d{9}$/.test(this.phoneBind))){
				this.$message('请输入正确手机号！')
			}else{
				let data = {
					type:1,
					unionId:this.unionId,
					phone:this.phoneBind,
				}
				this.$fetch('/api/member/bind_phone',data,'POST').then(res=>{
					if(res.data.returnCode == '0000'){
						this.$message({message:res.data.msg,type:'success'})
						//登陆成功
						this.$store.commit('userInfo/SET_TOKEN',res.data.data.token);
						this.$store.dispatch('userInfo/getUserInfo')
						this.phoneShow = false;
					}else{
						this.$message(res.data.msg)
					}
				})
			}
			
		}
	},
	
}
</script>

<style lang="scss">
@import '../assets/css/color';
.header{
	position: fixed;
	left:0;
	top:0;
	width: 100%;
	z-index:4;
	box-shadow: 0px 1px 4px 0 rgba(0,0,0,0.1);

	.header-login{
		width: 70px;
		line-height: 28px;
		border: 1px solid $color;
		border-radius: 2px;
		background: $color;
		margin-top:17px;

		&.header-login1{
			background: transparent;
			border-color: rgba(102, 102, 102, 0.5);
		}

		&:hover{
			border: 1px solid $color;
			background: $color;
			color: #fff;

		}
	}
}
.header-nav{
	margin-left:120px;
	.header-nav-con{
		margin-right: 50px;
		line-height:64px;
		cursor: pointer;
		&.on{
			color: $color;

			&:after{
				position: absolute;
				content: '';
				left:50%;
				transform: translateX(-50%);
				bottom:0;
				width: 18px;
				height:2px;
				background: $color;
			}
		}

		&:hover{
			color: $color;
		}
	}


}
.self{
    height:64px;
    .avatar{
        width:32px;
        height:32px;
        border-radius: 50%;
        margin-right:12px;
    }
    .username{
        font-size: 13px;
        color:#333;
        margin-right:10px;
    }
    .icon{
        width:9px;
        height:5px;
    }
}

.mask{
	width:100vw;
	height:100vh;
	background:rgba(0,0,0,0.5);
	position:fixed;
	left:0;
	top:0;
	.login-out,.bind-out{
		width:330px;
		height:362px;
		background-color:#fff;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
		position: absolute;
		left:50%;
		top:50%;
		transform: translate(-50%,-50%);
		padding:30px 33px;
		box-sizing: border-box;
		.close{
			width:18px;
			height:18px;
			background:url('../assets/img/close.png') 0 0/cover no-repeat;
			position:absolute;
			right:13px;
			top:14px;
		}
		.h2{
			font-size: 21px;
			color:#333;
			margin-bottom:24px;
		}
		.input{
			width:260px;
			height:38px;
			border:1px solid #dfdfdf;
			border-radius: 4px;
			padding:0 12px;
			box-sizing: border-box;
			margin-bottom:16px;
			.icon{
				width:10px;
				height:17px;
				margin-right:15px;
			}
			input{
				font-size:12px;
				// color:#dfdfdf;
			}
		}

		.code{
			width:260px;
			.input{
				width:156px;
				margin:0;
				.icon{
					width:15px;
					height:14px;
					margin-right:10px;
				}
				input{width:1px;}
			}
			.btn-code{
				width:96px;
				line-height:36px;
				font-size:12px;
				color:$color;
				text-align: center;
				border:1px solid $color;
				border-radius: 4px;
			}
		}
		.confirm{
			width:260px;
			line-height:38px;
			border-radius: 4px;
			background-color:$color;
			color:#fff;
			font-size: 14px;
			text-align: center;
			margin-top:20px;
		}
		.tip{
			margin-top:30px;
			color:#a7a7a7;
			font-size:12px;
			text-align: center;
			position:relative;
			&:before,&:after{
				content: '';
				width:65px;
				height:1px;
				background-color:#a7a7a7;
				position:absolute;
				top:50%;
			}
			&:before{left:0;}
			&:after{right:0;}
		}
		.weixin{
			display: block;
			width:38px;
			height:38px;
			margin:12px auto;
		}
	}
	.bind-out{height:270px;}
}
</style>