import requests
import bs4
import json
import re
import urllib.parse
import sys


avitoPath = sys.argv[1]

f= open("avito.txt","w+")
fr = int(sys.argv[3])
to = int(sys.argv[4])

print (str(fr) + '--->' + str(to))

if(fr == 1):
    res = requests.get(avitoPath)
    soup = bs4.BeautifulSoup(res.text, 'lxml')
    for links in soup.find_all('a', 'li-card'):
        ScriptRes = requests.get(links['href'])
        scriptSoup =   bs4.BeautifulSoup(ScriptRes.content, 'lxml')
        scriptObj = str(scriptSoup.find_all('script', id = '__NEXT_DATA__')[0])[51:-9]
        scriptJson = json.loads(scriptObj)
        if(scriptJson['props']['initialReduxState']['ad']['view']['adInfo']['phone']):
            f.write(scriptJson['props']['initialReduxState']['ad']['view']['adInfo']['phone'] + "\n")
        ScriptRes.close()
    res.close()
    fr = fr + 1
if(to > 2):
    avitoPath = avitoPath + sys.argv[2]
    print (avitoPath)
    for i in range(fr,to):
        res = requests.get(avitoPath + str(i))
        soup = bs4.BeautifulSoup(res.text, 'lxml')
        for links in soup.find_all('a', 'li-card'):
            ScriptRes = requests.get(links['href'])
            scriptSoup =   bs4.BeautifulSoup(ScriptRes.content, 'lxml')
            scriptObj = str(scriptSoup.find_all('script', id = '__NEXT_DATA__')[0])[51:-9]
            scriptJson = json.loads(scriptObj)
            if(scriptJson['props']['initialReduxState']['ad']['view']['adInfo']['phone']):
                f.write(scriptJson['props']['initialReduxState']['ad']['view']['adInfo']['phone'] + "\n")
            ScriptRes.close()
        res.close()
f.close() 
print ("terminer")
sys.stdout.flush()
    