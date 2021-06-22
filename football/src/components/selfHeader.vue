<template>
	<div class="bgfff header">
		<div class="wid1200 marginauto f-cb">
			<img src="../assets/img/logo.png" class="fl mr15 cursor" @click="goHome">
			<img src="../assets/img/logo1.png" class="fl mt17 cursor" @click="goHome">
			<p class="navigator-title fl">个人中心</p>
            
			<!-- <div class="self fr flex cursor" v-if="userInfo">
				<img class="avatar" :src="userInfo.avatar" alt="">
				<p class="username">{{userInfo.nickName}}</p>
				<img class="icon" src="@/assets/img/down.png" alt="">
			</div> -->
			<el-dropdown class="fr">
				<div class="el-dropdown-link self flex cursor">
					<img class="avatar" :src="userInfo&&userInfo.avatar" alt="">
					<p class="username">{{userInfo&&userInfo.nickName}}</p>
					<img class="icon" src="@/assets/img/down.png" alt="">
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item icon="el-icon-user"><router-link :to="{path:'/selfCenter',query:{ind:4}}">个人中心</router-link></el-dropdown-item>
					<el-dropdown-item icon="el-icon-sort"><span @click="signOut">退出登录</span></el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
            <!-- <div class="self fr flex">
                <img class="avatar" src="@/assets/img/weixin.png" alt="">
                <p class="username">噜啦啦</p>
                <img class="icon" src="@/assets/img/down.png" alt="">
            </div> -->
		</div>
	</div>
</template>

<script>
export default {
	components:{},
	data(){
		return {
			
		}
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo.userInfo
		}
	},
	methods:{
		goHome(){this.$router.push('/')},
		signOut(){
			this.$store.commit('userInfo/SET_TOKEN','');
			this.$store.commit('userInfo/SET_USERINFO',null);
			this.$router.push('/');
		}
	},
	created(){},
	mounted(){

	}
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
.navigator-title{
    font-size:17px;
    color:#333;
    line-height:64px;
    margin-left:24px;

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

</style>