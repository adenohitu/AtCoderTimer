var urlParam = location.search.substring(1);
url = '../api/contest.json?timestamp=' + new Date().getTime()
console.log(url)
const app = new Vue({
    el: '#app',
    data: {
        time: '',
        what_time: '',
        info: null,
        info_time_start: null,
        info_time_end: null,
        contest_name: '',
        contest_url: null,
        limit: null,
    },
    mounted: function() {
        let timerID = setInterval(this.updateTime, 60);
        info = null
        axios
            .get(url)
            .then(response => {
                //レスポンスヘッダーよりサーバー時間を取得
                servertime = new Date(response.headers.date)
                diff = moment(servertime) - moment()
                console.log(diff);
                info = response
                info = info.data.find((v) => v.name_short === urlParam);
                this.contest_name = info.name_long
                this.contest_url = 'https://atcoder.jp/contests/' + info.name_short
                this.limit = info.time_limit.slice(0, -2) + "時間" + info.time_limit.substr(-2) + "分";
            })
    },
    methods: {
        updateTime: function() {
            if (info != null) {
                // 現在の時刻
                now = moment().add(diff, 'millisecond');
                if (now.isBefore(moment(info.time_start))) {
                    this.what_time = "コンテストまで"
                    day = moment(info.time_start).diff(moment(now), 'day')
                    hour = moment(info.time_start).diff(moment(now), 'hours')
                    minutes = moment(info.time_start).diff(moment(now), 'minutes')
                    seconds = moment(info.time_start).diff(moment(now), 'seconds')
                    if (day == 0) {
                        ans = hour + ":" + ("0" + minutes % 60).slice(-2) + ":" + ("0" + (seconds % 60)).slice(-2)
                    } else {
                        ans = day + "日" + ("0" + hour % 24).slice(-2) + ":" + ("0" + minutes % 60).slice(-2) + ":" + ("0" + (seconds % 60)).slice(-2)
                    }
                    this.time = ans
                    this.info = moment(info.time_start).format('YYYY年MM月DD日 HH:mm:ss (dd)') + "--" + moment(info.time_end).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                    this.info_time_start = moment(info.time_start).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                    this.info_time_end = moment(info.time_end).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                } else if (now.isBefore(moment(info.time_end))) {
                    this.what_time = "残り時間"
                    hour = moment(info.time_end).diff(moment(now), 'hours')
                    minutes = moment(info.time_end).diff(moment(now), 'minutes')
                    seconds = moment(info.time_end).diff(moment(now), 'seconds')
                    ans = hour + ":" + ("0" + minutes % 60).slice(-2) + ":" + ("0" + (seconds % 60)).slice(-2)
                    this.time = ans
                    this.info = moment(info.time_start).format('YYYY年MM月DD日 HH:mm:ss (dd)') + "--" + moment(info.time_end).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                    this.info_time_start = moment(info.time_start).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                    this.info_time_end = moment(info.time_end).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                } else {
                    this.time = "-------"
                    this.what_time = "コンテストは終了しました"
                    this.info = moment(info.time_start).format('YYYY年MM月DD日 HH:mm:ss (dd)') + "--" + moment(info.time_end).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                    this.info_time_start = moment(info.time_start).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                    this.info_time_end = moment(info.time_end).format('YYYY年MM月DD日 HH:mm:ss (dd)')
                }
            }
        },
    }
})