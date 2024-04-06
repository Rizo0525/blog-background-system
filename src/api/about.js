import request from '@/utils/request'

export function getAbout(){
    return request.get('/api/about')
}

export function setAbout(data){
    return request.post('/api/about',data)
}