<template>
    <div class="acount-safe-page">
        <p class="h3">账号与安全</p>
        <div class="flex-sp top-tip">
            <div class="flex">
                <img class="icon-phone" src="@/assets/img/phone2.png" alt="">
                <span class="fsize14 label">手机账号</span>
                <span class="fsize12 tip">您的手机号：{{userInfo&&userInfo.phone}}已通过认证</span>
            </div>
            <!-- <div class="change fsize12 cursor">修改></div> -->
        </div>
        <div class="aoucnt-con bgf5f5f5 fsize14 co333">
            <div class="flex mb25">
                <div class="label">手机号码</div>
                <div class="co666">{{userInfo&&userInfo.phone}}</div>
            </div>
            <div class="flex mb20">
                <div class="label">原手机验证码</div>
                <div class="input flex">
                    <input class="flex-son pl10" type="text" v-model="oldCode">
                    <div class="send center cursor" @click="sendFcode">{{oldDely}}</div>
                </div>
            </div>
            <div class="flex mb20">
                <div class="label">新手机号码</div>
                <input class="input pl10" type="text" v-model="newPhone">
            </div>
            <div class="flex mb25">
                <div class="label">手机验证码</div>
                <div class="input flex">
                    <input class="flex-son pl10" type="text" v-model="newCode">
                    <div class="send center cursor" @click="checkOldPhone">{{newDely}}</div>
                </div>
            </div>
            <div class="flex">
                <div class="confirm cofff fsize14 center cursor" @click="confirm">确认</div>
                <div class="cancle cofff fsize14 center cursor" @click="goBack">取消</div>
            </div>
        </div>

        <div class="btm flex-sp">
            <div class="flex">
                <img class="icon-wx-grey" src="@/assets/img/wx-grey.png" alt="">
                <span class="fsize14">绑定微信账号</span>
                <span class="status fsize12">{{userInfo&&userInfo.isWechat==1?'已绑定':'未绑定'}}</span>
            </div>
            <div class="change fsize12 cursor" @click="wxBind">{{userInfo&&userInfo.isWechat==1?'解除绑定>':'去绑定>'}}</div>
        </div>
    </div>
</template>

<script>
export default {
	components:{},
	data(){
		return {
            newPhone:'',
            oldCode:'',
            newCode:'',
            oldDely:'发送验证码',
            newDely:'发送验证码',
		}
    },
    mounted(){
        this.giveCode();
    },
    computed:{
		userInfo(){
			return this.$store.state.userInfo.userInfo
		}
	},
    methods:{
        sendFcode(){
            //获取原手机验证码
            if(this.oldDely == '发送验证码'){
                let num = 60
				this.oldDely = num+'s';
				let timer = setInterval(()=>{
					num--;
					if(num === 0){
						this.oldDely = '发送验证码';
						clearInterval(timer);
					}else{
						this.oldDely = num+'s';
					}
                },1000)
                this.$fetch('/api/member/send_sms',{type:2},'POST').then(res=>{
                    if(res.data.returnCode != '0000'){
                        this.$message(res.data.msg)
                    }
                })
            }
            
        },
        checkOldPhone(){
            if(this.newDely == '发送验证码'){
                if(!(/^1[34578]\d{9}$/.test(this.newPhone))){
                    this.$message('请输入正确的新手机号！')
                }else if(!this.oldCode){
                    this.$message('请输入原手机号验证码！')
                }else{
                    //验证原手机号
                    this.$fetch('/api/member/old_phone',{smsCode:this.oldCode},'POST').then(res=>{
                        if(res.data.returnCode != '0000'){
                            this.$message(res.data.msg);
                        }else{
                            this.sendTcode();
                        }
                    })
                }
            }
        },
        sendTcode(){
            let num = 60
            this.newDely = num+'s';
            let timer = setInterval(()=>{
                num--;
                if(num === 0){
                    this.newDely = '发送验证码';
                    clearInterval(timer);
                }else{
                    this.newDely = num+'s';
                }
            },1000)
            //获取新手机验证码
            this.$fetch('/api/member/send_sms',{phone:this.newPhone,type:3},'POST').then(res=>{
                if(res.data.returnCode != '0000'){
                    this.$message(res.data.msg)
                }
            })
        },
        confirm(){
            //验证新手机号
            if(!this.newCode){
                this.$message('请输入新手机号验证码！')
            }else{
                this.$fetch('/api/member/phone',{newPhone:this.newPhone,newSmsCode:this.newCode},'POST').then(res=>{
                    if(res.data.returnCode != '0000'){
                        this.$message(res.data.msg)
                    }else{
                        this.$message({message:res.data.msg,type:'success'})
                        //修改成功,token将失效
                        this.$store.dispatch('userInfo/getUserInfo')
                        this.$router.push('/')
                    }
                })
            }
        },
        goBack(){
            this.$router.back(-1);
        },
        wxBind(){
            let isWechat = this.userInfo.isWechat;
            if(isWechat == 1){//已绑，解绑
                this.$confirm('解除微信账号后将无法继续使用它登录', '确定要解除微信绑定?', {
                    confirmButtonText: '解除绑定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$fetch('/api/member/unbind_wechat').then(res=>{
                        if(res.data.returnCode == '0000'){
                            this.$message({message:res.data.msg,type:'success'})
                            this.userInfo.isWechat = 0;
                        }else{
                            this.$message(res.data.msg)
                        }
                    })
                }).catch(()=>{})
                
            }else{//未绑，绑定
                this.wxSweep();
            }
        },
        wxSweep(){
			let appId = 'wxcaac082b1a124f77'	//公众号平台提供的appId
			let redirectURI = window.location.href	//扫码后回调地址
			window.location.href =
				'https://open.weixin.qq.com/connect/qrconnect?appid=' +
				appId +
				'&redirect_uri=' +
				encodeURIComponent(redirectURI) +
				'&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
        },
        giveCode(){
            //微信登录扫码后截取路径上的code
			let params = window.location.href.split('code=');
			if(params.length>1){
				let code = params[params.length-1].split('&')[0];
				this.$fetch('/api/member/bind_wechat_pc',{code},'POST').then(res=>{
					if(res.data.returnCode == '0000'){
                        this.$message({message:res.data.msg,type:'success'})
                        this.userInfo.isWechat = 1;
                    }else{
                        this.$message(res.data.msg)
                    }
				})
			}
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';

.acount-safe-page{
    min-height:618px;
	.h3{
        font-size:18px;
        color:#333;
        line-height:70px;
        border-bottom:1px solid #f5f5f5;
    }
    .change{color:#299dff}
    .top-tip{
        margin:22px 0 12px;
        .icon-phone{margin-right:13px;}
        .label{color:$grey;margin-right:22px;}
        .tip{color:#a7a7a7;}
        
    }
    .aoucnt-con{
        width:100%;
        min-height:360px;
        padding-top:48px;
        box-sizing: border-box;
        border-top:2px solid #e1e1e1;
        .label{
            width:280px;
            text-align: right;
            padding-right:20px;
            box-sizing: border-box;
        }
        .input{
            width:328px;
            line-height:35px;
            background-color:#fff;
            border:1px solid #bfbfbf;
            border-radius: 4px;
            .send{
                width:102px;
                border-left:1px solid #bfbfbf;
                color:#9d9d9d;
            }
        }

        .confirm,.cancle{width:117px;line-height:38px;border-radius: 2px;}
        .confirm{background-color: $color;margin-left:280px;}
        .cancle{background-color: #c0c0c0;margin-left:10px;}
    }
    .btm{
        margin-top:24px;
        padding-bottom:14px;
        border-bottom:2px solid #e1e1e1;
        .icon-wx-grey{margin-right:7px;}
        .status{margin-left:36px;color:#f1b246;}
    }
}

</style>