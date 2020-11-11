import requests
from bs4 import BeautifulSoup
import datetime
import json
json_open = open('view/api/contest.json', 'r')

json_load = json.load(json_open)
dt_now = datetime.datetime.now()

json_load=[i for i in json_load if datetime.datetime.fromisoformat(i['time_end'])>dt_now]

list_name_short=[d['name_short'] for d in json_load]

url = "https://atcoder.jp/contests/?lang=ja"
response = requests.get(url)
response.encoding = response.apparent_encoding

bs = BeautifulSoup(response.text, 'html.parser')

upcoming = bs.find(id="contest-table-upcoming")

upcoming = upcoming.find_all('tr')

for i in range(1, len(upcoming)):
    time_start = upcoming[i].find('time').get_text()[0:19]
    name_long = upcoming[i].find_all('a')[1].get_text()
    contest_url = upcoming[i].find_all('a')[1].get('href')
    time_limit = upcoming[i].find_all(class_="text-center")[1].get_text()
    name_short = contest_url[10:]
    tmp_start = datetime.datetime.strptime(time_start, "%Y-%m-%d %H:%M:%S")
    time_end = tmp_start + datetime.timedelta(hours=int(time_limit[:-3]), minutes=int(time_limit[-2:]))
    time_end=time_end.isoformat()
    time_start=tmp_start.isoformat()
    if name_short in list_name_short:
        index=list_name_short.index(name_short)
        json_load[index]={'name_long': name_long, 'name_short': name_short, 'time_start': time_start, 'time_end': time_end, 'time_limit': time_limit}
    else:
        adddata={'name_long': name_long, 'name_short': name_short, 'time_start': time_start, 'time_end': time_end, 'time_limit': time_limit}
        json_load.append(adddata)

json_load = sorted(json_load, key=lambda x:x['time_start'])
print(json.dumps(json_load))

fd = open('view/api/contest.json', mode='w')
json.dump(json_load, fd)
fd.close()
