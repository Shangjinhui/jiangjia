<template>
    <div class="app-download">
        <my-header nav="5"></my-header>
        <div class="app-d-con">
            <div class="app-d-con-inner wid1200 marginauto">
                <div class="top">
                    <img class="font" src="@/assets/img/font1.png" alt="">
                    <img class="code" src="@/assets/img/code.png" alt="">
                </div>
                <div class="text-con fsize14 co666" v-html="text">
                    
                </div>
            </div>
        </div>
        <my-footer></my-footer>
        <!-- 悬浮楼梯 -->
        <div class="floor flex-top">
            <ul class="fsize14 co666">
                <li class="flex-center center cursor" :class="[{'on':selected==index,'edit':item.icon=='edit','toup':item.icon=='toup'}]" v-for="(item,index) in appList" :key="index" @click="changeFloor(item,index)">
                    <span v-html="item.title"></span>
                    <!-- <img class="code" v-if="selected==index" :src="item.img" alt=""> -->
                    <div class="code" v-if="selected==index" :style="{backgroundImage:`url(${item.img})`}"></div>
                </li>
            </ul>
        </div>
        <!-- 反馈弹窗 -->
        <div class="mask" v-if="editShow">
            <div class="con">
                <div class="close cursor" @click="editShow = false"></div>
                <p class="title">问题反馈</p>
                <ul>
                    <li>
                        <p class="tip">标题</p>
                        <input type="text" placeholder="请输入标题内容" v-model="title">
                    </li>
                    <li>
                        <p class="tip">内容描述</p>
                        <textarea placeholder="请输入内容描述" v-model="desc"></textarea>
                    </li>
                </ul>
                <div class="img flex-center">
                    <img :src="photo||addImg" alt="">
                    <input ref="img" class="cursor" re type="file" accept="image/*">
                </div>
                <div class="btn cursor" @click="feedBack">提交反馈</div>
            </div>
        </div>
    </div>
</template>

<script>
import myHeader from "../components/header";
import myFooter from "../components/footer";
export default {
	components:{myHeader,myFooter},
	data(){
		return {
            editShow:false,
            text:'',
			appList:[{
                title:'进球哨<br/>APP',
                img:require('@/assets/img/code.png')
            },{
                title:'进球哨<br/>小程序',
                img:require('@/assets/img/xcx.jpg')
            },{
                icon:'edit'
            },{
                icon:'toup'
            }],
            selected:0,
            title:'',
            desc:'',
            addImg:require('@/assets/img/add.png'),
            photo:'',
            photoId:'',
		}
    },
    mounted(){
        this.getText();
    },
    methods:{
        getText(){
            this.$fetch('/api/common/get_page',{id:59}).then(res=>{
                if(res.data.returnCode == '0000'){
                    this.text = res.data.data.content;
                }else{
                    this.$message(res.data.msg);
                }
            })
        },
        fileInit(){
            const that = this;
            this.$refs['img'].addEventListener('change',function(e){
                let file = this.files[0];
                let fromData = new FormData();
                fromData.append('uploadFile',file)
                //console.log(fromData)
                that.$fetch('/web/fileupload/photo',fromData,'POST').then(res=>{
                    //console.log(res,'图片上传')
                    if(res.data.returnCode == '0000'){
                        that.photo = res.data.data.imgurl;
                        that.photoId = res.data.data.id;
                    }else{
                        that.$message(res.data.msg);
                    }
                })

                
                
            })
        },
        changeFloor(item,ind){
            this.selected = ind;
            if(item.icon == 'toup'){
                window.scrollTo(0,0);
            }else if(item.icon == 'edit'){
                this.editShow = true;
                this.$nextTick(()=>{this.fileInit()})
            }
        },
        feedBack(){
            if(!this.title){
                this.$message('请输入标题内容')
            }else if(!this.desc){
                this.$message('请输入描述问题')
            }else{
                let data = {
                    title:this.title,
                    content:this.desc,
                    photo:this.photoId
                }
                this.$fetch('/api/common/create_suggest',data,'POST').then(res=>{
                    if(res.data.returnCode == '0000'){
                        this.$message({message:'感谢您的反馈，我们将更加努力',type:'success'})
                        this.editShow = false;
					}else{
						that.$message(res.data.msg);
					}
                })
            }
            
        }
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';
.app-download{padding-top:64px;}
.app-d-con{
    width:100%;
    min-width:1200px;
    min-height:1180px;
    background:#f2f2f2 url('../assets/img/app-down-bg.png') top center/auto no-repeat;

    .top{
        width:100%;
        height:525px;
        position:relative;
        .font{
            position:absolute;
            top:110px;
            left:180px;
        }
        .code{
            width:200px;
            height:200px;
            position:absolute;
            top:212px;
            left:200px;
        }
    }
    .text-con{
        width:100%;
        min-height:596px;
        background-color:#fff;
        padding:28px 20px;
        box-sizing: border-box;
        border-radius: 2px;
    }

    
}


.floor{
        position:fixed;
        top:420px;
        right:130px;
        ul{
            width:220px;
            padding-top:42px;
            li{
                width:72px;
                height:72px;
                line-height:18px;
                background-color:#fff;
                margin-bottom:7px;
                border-radius: 4px;
                position:relative;
                &.edit{
                    background:#fff url('../assets/img/edit.png') center no-repeat;
                }
                &.edit.on,&.edit:hover{
                    background:$color url('../assets/img/edit2.png') center no-repeat;
                }
                &.toup{
                    background:#fff url('../assets/img/to-up.png') center no-repeat;
                }
                &.toup.on,&.toup:hover{
                    background:$color url('../assets/img/to-up2.png') center no-repeat;
                }
                &.on,&:hover{
                    background-color:$color;
                    color:#fff;
                }

                .code{
                    width:130px;
                    height:130px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    position: absolute;
                    right:-135px;
                    top:-50px
                }
            }
        }
    }
    @media screen and (max-width:1200px) {
        .floor{right:10px;}
    }
    @media (min-width:1201px) and (max-width:1800px) {
        .floor{right:5%;}
    }

    .mask{
        width:100vw;
        height:100vh;
        background:rgba(0,0,0,.3);
        position: fixed;
        left:0;
        top:0;
        .con{
            width:550px;
            height:550px;
            padding:0 28px;
            box-sizing: border-box;
            background-color:#fff;
            border-radius: 8px;
            position:absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
            color:#333;
            .close{
                width:18px;
                height:18px;
                background:url('../assets/img/close.png') 0 0/cover no-repeat;
                position:absolute;
                right:13px;
                top:14px;
            }
            .title{
                line-height:56px;
                font-size:16px;
                
                border-bottom:1px solid #f4f4f4;
            }
            ul{
                li{
                    margin-top:13px;
                    font-size:14px;
                    .tip{line-height:36px;}
                    input,textarea{
                        width:100%;
                        height:36px;
                        line-height:36px;
                        border:1px solid #dfdfdf;
                        border-radius: 2px;
                        padding:4px 14px;
                        box-sizing: border-box;
                    }
                    textarea{min-height:160px;line-height:1.5;resize:none;}
                }
            }
            .img{
                margin-top:16px;
                width:70px;
                height:70px;
                background-color:#f7f7f7;
                position: relative;
                input{
                    width:100%;
                    height:100%;
                    position: absolute;
                    left:0;
                    top:0;
                    opacity: 0;
                }
            }
            .btn{
                width: 212px;
                line-height:54px;
                text-align: center;
                font-size:16px;
                color:#fff;
                font-weight:bold;
                background-color: $color;
                border-radius: 4px;
                margin:20px auto;
            }
        }
    }
</style>
