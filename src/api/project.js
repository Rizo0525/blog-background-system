import request from '@/utils/request'
//新增项目
export function addProject(data){
    return request({
        method:'post',
        url:'/api/project',
        data
    })
}
//获取项目
export function getProject(){
    return request({
        url:'/api/project',
        method:'get'
    })
}
//修改项目
export function updateProject(id,data){
    return request({
        url:`/api/project/${id}`,
        method:'put',
        data
    })
}

//删除项目
export function deleteProject(id){
    return request({
        url:`/api/project/${id}`,
        method:'delete'
    })
}