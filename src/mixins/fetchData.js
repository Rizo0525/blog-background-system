export function fetchData(dataType=null){
    return {
        data(){
            return {
                data:dataType,
                loading:true
            }
        },
        async created(){
            this.data = await this.fetchData()
            this.loading = false
        }
    }
}