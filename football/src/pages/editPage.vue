<template>
<div class="pt80">
    <my-header nav="1"></my-header>
    <div class="wid1200 marginauto pb50 mh850 bgfff pl20 pr20 pt20" v-html="textarea">

    </div>
    <my-footer></my-footer>
</div>
</template>

<script>
import myHeader from "../components/header";
import myFooter from "../components/footer";
export default {
	components:{myHeader,myFooter},
	data(){
		return {
			textarea:''
		}
    },
    mounted(){
        this.textarea = decodeURI(this.$route.query.text||'');
    }
}
</script>