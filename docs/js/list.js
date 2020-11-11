var urlParam = location.search.substring(1);
url = '../api/contest.json'
console.log(url)
new Vue({
    el: '#app',
    data() {
        return {
            info: null,
            loading: true,
            errored: false
        }
    },
    filters: {
        currencydecimal(value) {
            return value.toFixed(2)
        }
    },
    mounted() {
        axios
            .get(url)
            .then(response => {
                befores = response.data
                console.log(befores);

                befores.find(before => {
                    before.time_start = moment(before.time_start).format('YYYY/MM/DD(dd) HH:mm:ss');
                });
                befores.find(before => {
                    before.time_end = moment(before.time_end).format("HH:mm:ss");
                });
                befores.find(before => {
                    before.name_short = "../contest/?" + before.name_short
                });
                this.info = befores
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
    }
})