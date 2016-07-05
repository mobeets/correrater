import re
import glob
import json
import urllib
import random
import requests

DEFAULT_OPTS = {"type": "movie", "tomatoes": True, "plot": "short", "r": "json", "y": ""}

TOP_URL = "http://www.imdb.com/chart/top"
NEW_URL = "http://www.imdb.com/chart/top?sort=us,desc&mode=simple&page=1"
POP_URL = "http://www.imdb.com/chart/top?sort=nv,desc&mode=simple&page=1"

def urlf(query, tag="t", opts=DEFAULT_OPTS):
    opts[tag] = query
    return "http://www.omdbapi.com/?{query}".format(query=urllib.urlencode(opts))

def load_movie(url):
    return json.load(urllib.urlopen(url))

def find_movie(name):
    return load_movie(urlf(name))

def get_movie_ids():
    ids = []
    for infile in glob.glob('data/*.txt'):
        ids.extend([line.strip() for line in open(infile).readlines()])
    return list(set(ids))

def random_movies(n):
    # nums = ["tt" + str(int(random.random()*2155529)).zfill(7) for i in xrange(n)]
    ids = get_movie_ids()
    ids = [random.choice(ids) for i in xrange(n)]
    urls = [urlf(entry, tag="i") for entry in ids]
    return [load_movie(url) for url in urls]

def fetch_movie_ids(url=TOP_URL):
    source = requests.post(url).text
    return list(set(re.findall('/title/(\w+)/', source)))

def stash_imdb_ids():
    import os.path
    nms = ["top", "new", "popular"]
    urls = [TOP_URL, NEW_URL, POP_URL]
    for (nm, url) in zip(nms, urls):
        ids = fetch_movie_ids(url)
        fnm = os.path.join('data', 'imdb_ids_' + nm + '.txt')
        with open(fnm, 'w') as f:
            f.write('\n'.join(ids))

if __name__ == '__main__':
    # stash_imdb_ids()
    print get_movie_ids()
