const nextTiming = () => 1000 - Date.now() % 1000;

const app = new Vue({
    el: '#app',
    data: {
        time: '',
        what_time: ''
    },
    mounted: function() {
        let timerID = setInterval(this.updateTime, 60);
    },
    methods: {
        updateTime: function() {
            // 現在の時刻
            this.time = moment().format("HH:mm:ss")
        },
    }
})