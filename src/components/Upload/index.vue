<template>
    <div>
        <div class="title">{{ uploadTitle }}</div>
        <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :headers="headers">
            <img v-if="value" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import { server_URL } from '@/urlConfig'
export default {
    props: ['uploadTitle', 'value'],
    methods:{
        handleAvatarSuccess(response, file, fileList){
            console.log('上传成功')
            console.log(response,file)
            // console.log(this)
            if(!response.code && response.data){
                // this.value = server_URL + response.data
                this.$emit('input',response.data)
            }
        }
    },
    computed:{
        headers(){
            return {
                Authorization: 'Bearer '+localStorage.getItem('adminToken'),
            }
        },
        imageUrl(){
            if(this.value){
                // return server_URL + this.value
                console.log("this.value:",this.value)
                console.log("this.value.path:",this.value.path)
                return this.value
            }
        }
    }
}
</script>

<style scoped>
.avatar-uploader .el-upload{
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>