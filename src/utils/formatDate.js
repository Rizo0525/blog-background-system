export function formatDate(unixStamp){
    unixStamp = Number(unixStamp)
    let map = new Map()
    map.set(1,'星期一')
    map.set(2,'星期二')
    map.set(3,'星期三')
    map.set(4,'星期四')
    map.set(5,'星期五')
    map.set(6,'星期六')
    map.set(0,'星期天')
    let d = new Date(unixStamp)
    let year = d.getFullYear()
    let month = (d.getMonth()+1).toString().padStart(2,'0')
    let date = d.getDate().toString().padStart(2,'0')
    let hour = d.getHours().toString().padStart(2,'0')
    let minute = d.getMinutes().toString().padStart(2,'0')
    let second = d.getSeconds().toString().padStart(2,'0')
    let day = d.getDay()
    let res = `${year}-${month}-${date} ${hour}:${minute}:${second} ${map.get(day)}`
    // console.log(res)
    return res
}