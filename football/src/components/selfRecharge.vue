<template>
<!-- 金币充值 -->
    <div class="recharge">
        <p class="h3">金币充值</p>
        <div>
            <div class="yue-out flex">
                <span class="label">金币余额</span>
                <span class="yue">{{userInfo&&userInfo.balance}}金币</span>
            </div>
            <div class="cont-out flex-top flex-wrap">
                <span class="label">充值金额</span>
                <ul class="count-list flex-son flex flex-wrap">
                    <li :class="[{'flex-center cursor':true,'selected':index===selected}]" v-for="(item,index) in coinList" :key="index" @click="chooseGold(item.id,index)">
                        <span class="coin">{{item.goldNumber}}金币</span>
                        <span class="price">{{item.price}}元</span>
                    </li>
                </ul>
                <div class="custom">
                    <p>自定义金额</p>
                    <div class="input flex">
                        <input class="flex-son" type="number" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入充值金额" v-model="customCoin">
                        <span>元</span>
                    </div>
                </div>
            </div>
            <div class="pay-type flex-top">
                <span class="label">支付方式</span>
                <ul class="flex flex-wrap">
                    <li :class="[{'flex-center cursor':true,'selected':payType===item.type}]" v-for="(item,index) in payTypeList" :key="index" @click="payType = item.type">
                        <img :src="item.icon" alt="">
                        <p>{{item.name}}</p>
                    </li>
                </ul>
            </div>
            <div class="btn cursor" @click="nowBuy">立即充值</div>
        </div>

        <!-- 微信二维码 -->
        <div class="mask" v-if="codeShow">
            <!-- <p class="fsize18 mb20 bold">充值完成后记得刷新页面哦~</p> -->
            <div id="qrcode">
                <p class="fsize18 mb20 bold">充值完成后记得刷新页面哦~</p>
                <img class="close cursor" src="@/assets/img/close.png" alt="" @click="codeShow = false">
            </div>
        </div>
        <!-- 支付宝表单 -->
        <div v-html="zfbForms"></div>
        <tip v-if="show" ctype="4"></tip>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2'  // 引入qrcode
import tip from '@/components/tip'
export default {
	components:{tip},
	data(){
		return {
			coinList:[
            ],
            customCoin:'',
            selected:-1,
            payTypeList:[
                // {
                //     icon:require("@/assets/img/zfb.png"),
                //     name:'支付宝',
                //     type:'aliPcPay'
                // },
                {
                    icon:require("@/assets/img/wx.png"),
                    name:'微信',
                    type:'wechatPcPay'
                }
            ],
            payType:'wechatPcPay',
            show:false,
            goldProductId:'',       //商品id
            codeShow:false,         //是否显示二维码
            zfbForms:''             //zfb表单
		}
    },
    computed:{
		userInfo(){
			return this.$store.state.userInfo.userInfo
		}
    },
    mounted(){
        this.getCoinList();
    },
    watch:{
        customCoin(val){//自定义金额则清除商品
            if(val){
                this.selected = -1;
                this.goldProductId = '';
            }
        }
    },
    methods:{
        getCoinList(){
            let coinList = this.$store.state.userInfo.goldProduct;
            if(coinList){
                this.coinList = coinList;
            }else{
                this.$fetch('/api/member/gold_product').then(res=>{
                    if(res.data.returnCode == '0000'){
                        this.coinList = res.data.data.list;
                        this.$store.commit('userInfo/SET_COIN',res.data.data.list)
                    }else{
                        this.$message(res.data.msg);
                    }
                })
            }
            
        },
        chooseGold(id,index){
            this.goldProductId = id;
            this.selected = index;
            //选商品则清除自定义金额
            this.customCoin = '';
        },
        nowBuy(){
            //console.log(this.customCoin)
            let data = {
                goldProductId:0,
                paymentCode:this.payType,
            }
            if(this.goldProductId){
                data.number = 1;
                data.goldProductId = this.goldProductId;
            }else if(this.customCoin){
                data.number = this.customCoin;
            }else{
                this.$message('请选择支付金额');
                return;
            }
            this.$fetch('/api/pay/index',data,'POST').then(res=>{
                if(res.data.returnCode == '0000'){
                    if(this.payType == 'wechatPcPay'){
                        this.codeShow = true;
                        this.$nextTick(()=>{
                            this.qrcode(res.data.data.result);
                        })
                    }else if(this.payType == 'aliPcPay'){
                        this.zfbForms = res.data.data.aliForm;
                        this.$nextTick(() => {
                            document.forms[0].submit()
                        })
                    }
                    
                }else{
                    this.$message(res.data.msg);
                }
            })
        },
        qrcode(url) {
            let qrcode = new QRCode('qrcode', {
                width: 132,  
                height: 132,
                text: url, // 二维码地址
            })
        },
    }
}
</script>

<style lang="scss">
@import '../assets/css/color';
.recharge{
    min-height:734px;
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
    .yue-out{
        margin-top:56px;
        .yue{
            color:$color;
        }
    }
    .cont-out{
        margin-top:37px;
        .count-list{
            li{
                flex-direction: column;
                width:138px;
                height:74px;
                border-radius: 4px;
                border:1px solid #ececec;
                margin-right:20px;
                margin-bottom:20px;
                .coin{
                    font-size:16px;
                    color:#333;
                }
                .price{
                    font-size:12px;
                    color:#999;
                    margin-top:10px;
                }

                &.selected{
                    background-color:$color;
                    border-color: $color;
                    .coin,.price{color:#fff;}
                }
            }
        }
        .custom{
            width:100%;
            margin-top:26px;
            margin-left:140px;
            p{
                font-size:12px;
                color:#999;
                margin-bottom:12px;
            }
            .input{
                width:138px;
                height:36px;
                padding:0 12px;
                border-radius: 4px;
                border:1px solid #bfbfbf;
                font-size:12px;
                input{width:1px;}
                span{
                    color:#696969;
                }
            }
        }
    }
    .pay-type{
        margin-top:28px;
        ul{
            li{
                width:138px;
                height:62px;
                border-radius: 4px;
                border:1px solid #ececec;
                margin-right:20px;
                margin-bottom:20px;
                font-size:12px;
                color:#999;
                img{
                    margin-right:8px;
                }
                &.selected{
                    border-color:$color;
                    background:url('../assets/img/zf-choose.png') 103px 27px no-repeat;
                }
            }
        }
    }
    .btn{
        width:116px;
        line-height:38px;
        text-align: center;
        font-size:14px;
        color:#fff;
        background-color:$color;
        margin-top:50px;
        margin-left:140px;
    }
}
.mask{
    width:100vw;
    height: 100vh;
    background:rgba(0,0,0,.3);
    position:fixed;
    left:0;
    top:0;
    z-index: 5;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    #qrcode{
        background-color: #fff;
        padding:40px 20px;
        border-radius: 4px;
        position: relative;
        img{margin:0 auto;}
    }
    .close{
        position:absolute;
        right:-30px;
        top:-16px;
    }
}
</style>