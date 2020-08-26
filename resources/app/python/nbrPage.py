import requests
import bs4
import sys

avitoPath = sys.argv[1]
res = requests.get(avitoPath)
soup = bs4.BeautifulSoup(res.text, 'lxml')
nbrPages = soup.find_all('ul', 'd-flex justify-content-center')[0].findChildren("a")
print (int(nbrPages[len(nbrPages) - 2].text));

res.close()
sys.stdout.flush()

