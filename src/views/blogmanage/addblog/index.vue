<template>
    <div class="app-container">
        <div class="block">文章标题</div>
        <div style="margin-bottom: 15px;">
            <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
        </div>
        <div class="block">文章编辑</div>
        <editor :initialValue="form.editorText" height="600px" ref="editor" :options="editorOptions" @change="onEditorChange"></editor>
        <div class="editor"></div>
        <div class="block">文章描述</div>
        <el-input v-model="form.description" type="textarea" :rows="6"></el-input>
        <div class="block">文章头图</div>
        <Upload v-model="form.thumb"></Upload>
        <div class="block">选择分类</div>
        <el-select v-model="form.selected" placeholder="请选择文章分类">
            <el-option v-for="item in blogTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
        <div>
            <el-button type="primary" style="margin-top: 15px;" @click="addArticle">发布文章</el-button>
        </div>
    </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';
import Upload from '@/components/Upload';
import { getBlogTypes,addBlog } from '@/api/blog';
import '@toast-ui/editor/dist/i18n/zh-cn'
import {upload} from '@/api/upload.js'


export default {
    data() {
        return {
            form: {
                title: '',
                editorText: '',
                description: '',
                thumb: '',
                selected:''
            },
            blogTypes: [],
            editorOptions:{
                language:'zh-CN'
            }
        }
    },
    components: {
        Editor, Upload
    },
    async created() {
        let resp = await getBlogTypes()
        this.blogTypes = resp.data
        // console.log(this.blogTypes)
    },
    mounted(){
        this.$refs.editor.editor.eventEmitter.removeEventHandler('addImageBlobHook')
        this.$refs.editor.editor.eventEmitter.listen('addImageBlobHook',async (blob,callback)=>{
            const formData = new FormData()
            // console.log(blob)
            formData.append('file',blob,blob.name)
            let resp = await upload(formData)
            // console.log(resp)
            callback(resp.data)
        })
     
    },
    methods:{
        async addArticle(){
            let html = this.$refs.editor.invoke('getHTML');
            let markdown = this.$refs.editor.invoke('getMarkdown');
            // console.log(html)
            let obj = {
                title:this.form.title,
                description:this.form.description,
                createDate:new Date().getTime(),
                categoryId:this.form.selected,
                toc:[],
                htmlContent:html,
                thumb:this.form.thumb,
                markdownContent:markdown
            }
            if(obj.title && obj.description && obj.htmlContent && obj.categoryId){
                let resp = await addBlog(obj)
                console.log(resp)
                if(resp.code===0){
                    //发布成功
                    this.$message.success('文章添加成功')
                    this.$router.push('/blogmanage/blogList')
                }else{
                    this.$message.error('文章添加失败')
                }
            }
            
        },
        onEditorChange(delta){
            // console.log(delta)
            // console.log(this.$refs.editor.invoke('getHTML'))
        }
    }
}
</script>

<style lang="less" scoped>
.block {
    margin: 15px 0;
    font-weight: 100;
}
</style>