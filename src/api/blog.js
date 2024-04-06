import request from '@/utils/request'

//分页获取文章
export function getBlogs(page=1,limit=5,categoryId=-1){
    return request({
        url:'/api/blog',
        method:'get',
        params:{
            page,limit
        }
    })
}

//删除单个博客
export function deleteBlog(id){
    return request({
        url:`/api/blog/${id}`,
        method:'delete',
    })
}
//获取博客分类
export function getBlogTypes(){
    return request({
        url:'/api/blogtype',
        method:'get'
    })
}
//添加博客分类
export function addBlogType(data){
    return request({
        url:'/api/blogtype',
        method:'post',
        data
    })
}
//更新博客分类
export function updateBlogType(editInfo){
    return request({
        url:`/api/blogtype/${editInfo.id}`,
        method:'put',
        data:editInfo.data
    })
}
//删除博客分类
export function deleteBlogType(id){
    return request({
        url:`/api/blogtype/${id}`,
        method:'delete'
    })
}
//发布文章
export function addBlog(data){
    return request({
        url:'/api/blog',
        method:'post',
        data
    })
}

//获取单篇文章
export function getBlog(id){
    return request({
        url:`/api/blog/${id}`,
        method:'get'
    })
}

//修改文章
export function editBlog(blogInfo){
    console.log(blogInfo)
    return request({
        url:`/api/blog/${blogInfo.id}`,
        method:'put',
        data:blogInfo.data
    })
}