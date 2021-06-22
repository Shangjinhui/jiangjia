<template>
    <div class="footer-text pt80">
        <my-header></my-header>
        <div class="wid1200 marginauto pb50 mh850 bgfff contain">
            <ul class="tab flex-center mb25">
                <li class="fsize16 col333 cursor" :class="[{'on':selected==item.id}]" v-for="item in tab" :key="item.id" @click="changeNav(item.id)">
                    {{item.name}}
                </li>
            </ul>
            <keep-alive>
                <text-area v-if="selected==1" id="30"></text-area>
            </keep-alive>
            <keep-alive>
                <text-area v-if="selected==2" id="60"></text-area>
            </keep-alive>
            <keep-alive>
                <text-area v-if="selected==3" id="61"></text-area>
            </keep-alive>
        </div>
        <my-footer></my-footer>
    </div>
</template>

<script>
import myHeader from "../components/header";
import myFooter from "../components/footer";
import textArea from "../components/textArea";
export default {
	components:{myHeader,myFooter,textArea},
	data(){
		return {
			tab:[{
                name:'关于我们',
                id:1
            },{
                name:'免责声明',
                id:2
            },{
                name:'联系方式',
                id:3
            }],
            //selected:-1,
		}
    },
    // mounted(){
    //     this.selected = this.$route.query.id||1;
    // },
    computed:{
        // selected(){
        //     window.scrollTo(0,0);
        //     return this.$route.query.id||1;
        // },
        selected:{
            get(){
                window.scrollTo(0,0);
                return this.$route.query.id||1;
            },
            set(value){
                //this.val = value
            }
        }
    },
    methods:{
        changeNav(id){
            if(this.selected == id) return;
            this.selected=id;
            this.$router.push({path:'/footerText',query:{id}})
        }
    }
}
</script>

<style lang="scss">
.footer-text{
    .contain{
        padding:0 40px;
        box-sizing: border-box;
        .tab{
            height:80px;
            border-bottom:1px solid #f5f5f5;
            li{
                line-height:80px;
                padding:0 55px;
                position:relative;
                &.on{
                    color:#ff261a;
                    &:after{
                        content: '';
                        width:28px;
                        height:3px;
                        background-color:#ff261a;
                        position:absolute;
                        left:50%;
                        bottom:-1px;
                        transform: translateX(-50%);
                    }
                }
            }
        }
    }
}
</style>