<template>
    <div class="userinfo-page">
        <p class="h3">基本信息</p>
		<div v-if="nowInfo">
			<div class="avatar-out flex-top">
                <span class="label">个人头像</span>
                <img class="avatar cursor" :src="avatarurl||nowInfo.avatar" alt="">
				<div class="up-avatar fsize12 cursor">上传头像
					<input ref="avatar" type="file" accept="image/*">
				</div>
            </div>
			<div class="acount-id flex">
				<span class="label">账号ID</span>
				<span class="co666 fsize14">{{nowInfo.showId}}</span>
			</div>
			<div class="phone flex">
				<span class="label">手机号码</span>
				<span class="co666 fsize14">{{nowInfo.phone}}</span>
				<router-link tag="span" class="change-phone fsize14 cursor" :to="{path:'/selfCenter',query:{ind:5}}">修改手机</router-link>
			</div>
			<div class="nickname flex">
				<span class="label">昵称</span>
				<input type="text" v-model="nowInfo.nickName">
			</div>
			<div class="confirm center fsize14 cursor" @click="save">保存</div>
		</div>
    </div>
</template>

<script>
export default {
	components:{},
	data(){
		return {
			nowInfo:null,
			avatarid:null,
			avatarurl:null,
		}
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo.userInfo
		}
	},
	watch:{
		userInfo(val,oldval){
			this.nowInfo = Object.assign({},val);
		}
	},
	mounted(){
		this.nowInfo = Object.assign({},this.$store.state.userInfo.userInfo);
		this.$nextTick(()=>{
			this.initInput();
		})	
	},
	methods:{
		initInput(){
			const that = this;
			this.$refs['avatar'].addEventListener('change',function(e){
				let file = this.files[0];
				let fromData = new FormData();
				fromData.append('uploadFile',file)
				//console.log(fromData)
				that.$fetch('/web/fileupload/photo',fromData,'POST').then(res=>{
					//console.log(res,'图片上传')
					if(res.data.returnCode == '0000'){
						that.avatarid = res.data.data.id;
						that.avatarurl = res.data.data.imgurl;
						that.$message({message:res.data.msg,type:'success'});
					}else{
						that.$message(res.data.msg);
					}
				})

				
				
			})
		},
		changeAvatar(url){
			
		},
		save(){
			let data = {
				avatar:this.avatarid,
				nickName:this.nowInfo.nickName
			}
			this.$fetch('/api/member/info',data,'POST').then(res=>{
				//console.log(res,'修改信息')
				if(res.data.returnCode == '0000'){
					this.$message({message:'修改成功',type:'success'});
					this.$store.dispatch('userInfo/getUserInfo');
				}else{
					that.$message(res.data.msg);
				}
			})
		}
	}
}
</script>

<style lang="scss">
@import '../assets/css/color';

.userinfo-page{
	min-height:618px;
	.h3{
        font-size:18px;
        color:#333;
        line-height:70px;
        border-bottom:1px solid #f5f5f5;
	}
	.label{
        color:$grey;
        font-size:14px;
        line-height:22px;
        width:140px;
        padding-right:20px;
        box-sizing: border-box;
        text-align: right;
	}
	.avatar-out{
		padding-top:52px;
		.avatar{
			width:72px;
			height:72px;
			border-radius: 50%;
			margin-right:35px;
		}
		.up-avatar{
			width:66px;
			height:26px;
			line-height:26px;
			text-align: center;
			color:#707070;
			border:1px solid #707070;
			border-radius: 2px;
			margin-top:44px;
			position:relative;
			input{
				width:100%;
				height:100%;
				position:absolute;
				left:0;
				top:0;
				opacity: 0;
			}
		}
	}
	.acount-id{margin-top:54px;}
	.phone{
		margin-top:46px;
		.change-phone{
			color:$color;
			text-decoration: underline;
			margin-left:25px;
		}
	}
	.nickname{
		margin-top:38px;
		input{
			width:382px;
			line-height:34px;
			border-radius: 2px;
			border:1px solid #707070;
			padding:0 15px;
			box-sizing: border-box;
		}
	}
	.confirm{
		margin-top:26px;
		margin-left:140px;
		width:116px;
		line-height:38px;
		background-color:$color;
		color:#fff;
		border-radius: 2px;
	}
}
</style>