<template>
    <div class="fixedPage" v-if="showCropper">
      <div class="fixedPage_bg" @click="hideCropperBlock"></div>
      <div class="fixedPage_block cropper_view">
         <div class="cropper_wrapper">
              <vueCropper
              ref="cropper"
              :img="cropperOption.img"
              :outputSize="cropperOption.size"
              :outputType="cropperOption.outputType"
              :info="true"
              :full="cropperOption.full"
              :canScale = "cropperOption.canScale"
              :canMove="cropperOption.canMove"
              :canMoveBox="cropperOption.canMoveBox"
              :fixedBox="cropperOption.fixedBox"
              :original="cropperOption.original"
              :autoCrop="cropperOption.autoCrop"
              :autoCropWidth="cropperOption.autoCropWidth"
              :autoCropHeight="cropperOption.autoCropHeight"
              :fixed="cropperOption.fixed"
              :fixedNumber="cropperOption.fixedNumber"
              :centerBox="cropperOption.centerBox"
              @cropDblclick="cropDblclick"
              ></vueCropper>
          </div>
            
          <!-- <div style="text-align:center;padding:10px 0;">
              <span>当前截图框状态：</span>
              <span v-if="cropperOption.fixed">固定框</span>
              <span v-else>自定义框</span>
          </div> -->
          <div style="text-align:center;padding:10px 0;">
            <!-- <el-button type="danger"  @click="changeFixed">切换模式</el-button> -->
            <el-button type="danger"  @click="getCropperData">合成</el-button>
          </div>
          <!-- <div class="going" v-if="disable">上传中...</div> -->
      </div>
      <canvas ref="shared" width="500" height="400"></canvas>
    </div>
</template>

<script>
import { requestApi } from '@/api/index'
import { getTimeString } from '@/utils/filter'
import OSS from 'ali-oss'
import vueCropper from '@/components/Cropper/vue-cropper.vue'
import {upload,replaceDomainName} from '@/utils/common'
// var vueCropper = require('@/components/vue-cropper/vue-cropper.js')
// const md5 = require('crypto-js/md5');
// var apiJs = require('@/config/api.js');
// var COSSDK = require('cos-js-sdk-v5');
// var cos;

export default {
    props:{
      client:{
        type:Object,
        default:{}
      }
    },
    name: 'Cropper',
    components: {
      vueCropper
    },
    data () {
        return {
            showCropper:false,
            cropperOption: {
              img:'',
              size: 1,
              full: false,
              outputType: 'jpeg',
              info: true,
              canMove: false,
              canMoveBox:true,
              fixedBox:false,
              canScale: false,
              original:false,// 上传图片按照原始比例渲染
              autoCrop: true,
              // 只有自动截图开启 宽度高度才生效
              autoCropWidth: 800,//默认生成截图框宽度
              autoCropHeight: 400,// 默认生成截图框高度
              // 开启宽度和高度比例
              fixed: true,//是否开启截图框宽高固定比例
              fixedNumber: [5, 4],//截图框的宽高比例
              centerBox: true,
            },
            disable:false,
            // uploadType:null,//1首页2推荐3分享
            name: '',
            author: '',
            type: '',
        }
    },
    mounted(){
    },
    activated(){

    },
    watch:{

    },
    methods:{
      changeFixed:function(type){
          var that = this;
          this.cropperOption.fixed = !this.cropperOption.fixed;
          that.$nextTick(function(){
              that.$refs.cropper.goAutoCrop();
          })
      },
      cropDblclick:function(msg){
        console.log(msg)
        this.getCropperData();
      },
    	showCropperBlock:function(){
  		  this.showCropper = true;
  		},
  		hideCropperBlock:function(){
  		  this.showCropper = false;
  		},
      getCropperData(){
  		  var that = this;
        if(this.disable){
            return;
        }
        this.disable = true;
  		  this.$refs.cropper.getCropBlob((data) => {
  		      var reader = new FileReader();  
  		      reader.readAsDataURL(data);  
  		      //监听文件读取结束后事件  
  		      reader.onloadend = function (e) { 
  		        that.cropper_upload(e.target.result);
  		      }; 
  		  })
  		},
  		async cropper_upload(imgData){
        let self = this;
        let name = this.name;
        let author = this.author;

        let sharedRef = this.$refs.shared;
        let ctx = sharedRef.getContext('2d')
        let imagebg = new Image();
        let imageMake = new Image();
        let imageMakeBf = new Image();
        imageMake.setAttribute('crossOrigin', 'anonymous');
        imageMakeBf.setAttribute('crossOrigin', 'anonymous');


        imagebg.src = imgData  // base 64格式
        imagebg.onload =  function () {
          ctx.drawImage(imagebg, 0, 0, 500, 400);

          ctx.textAlign = 'center';
          ctx.fillStyle = '#fff';
          ctx.font = `40px Arial`;
          if(self.type === 'video') {
            ctx.fillText(`发布者：${author}`, 250, 310);
            imageMake.src = 'https://res.heywoodsminiprogram.com/albumImages/feitian/common/dianji1.png';
            imageMake.onload = function () {
              ctx.drawImage(imageMake, 0, 0, 500, 400);
              // imageMakeBf.src = 'https://res.heywoodsminiprogram.com/albumImages/feitian/common/bofang.png';
              // imageMakeBf.onload = function() {
              //   ctx.drawImage(imageMakeBf, 0, 0, 250, 200);
                let sharedImg = sharedRef.toDataURL("image/png");
                let fileImg = self.dataURLtoFile(sharedImg, name);
                self.upload_shared(fileImg)
              // }
            }
          } else {
            ctx.fillText(`制作人：${author}`, 250, 310);
            imageMake.src = 'https://res.heywoodsminiprogram.com/albumImages/feitian/common/dianji.png';
            imageMake.onload = function () {
              ctx.drawImage(imageMake, 0, 0, 500, 400);

              let sharedImg = sharedRef.toDataURL("image/png");
              let fileImg = self.dataURLtoFile(sharedImg, name);
              self.upload_shared(fileImg)

            }
          }
            
              self.showCropper = false;
          
        }
      },
      dataURLtoFile(dataurl, name = 'image/png') {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length; 
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        //转换成file对象
        return new File([u8arr], name, {type:mime});
        //转换成成blob对象
        //return new Blob([u8arr],{type:mime});
      },
      async upload_shared (file){
        // this.shared = file.name
        this.$loading()
        upload(this.client,{file:file},process.env.UPLOAD_THUMB_URL + getTimeString(1)).then(res=>{
            this.$emit('uploadShare',res.url)
            this.$loading().close()
        })
      },
  		setFixedNumber(num){
  			this.cropperOption.fixedNumber = num;
  		},
  		setImg(img, name, author, type){
        this.type = type;
        this.author = author
        this.name = name
  		  this.showCropper = true;
        this.disable = false;
        this.cropperOption.fixed =true;
        this.cropperOption.img = img;
        this.$nextTick(() =>{
            this.$refs.cropper.startCrop();
        })
  		}
  	}
}
</script>

<style scoped>
  .fixedPage{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  .fixedPage_bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0,0,0,0.7);
  }
  .fixedPage_block{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    z-index: 9999;
    background: #fff;
    border-radius: 10px;
  }
  .cropper_view{
    padding: 30px 30px 20px;
  }
  .cropper_wrapper{
    width: 800px;
    height: 600px;
    background: #fff;
  }
  .going{
    text-align: center;
    color: red;
    font-size: 16px;
    margin-top: 5px;
  }
</style>