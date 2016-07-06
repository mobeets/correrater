import os.path
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
    allms = load_imdb_objs()
    ms = []
    for i in xrange(n):
        j = random.choice(xrange(len(allms)))
        ms.append(allms[j])
        allms.pop(j)
    return ms

def random_movies_slow(n):
    """
    has to call OMDB api for each random id
    """
    all_ids = get_movie_ids()
    ids = []
    for i in xrange(n):
        curid = random.choice(xrange(len(all_ids)))
        ids.append(all_ids[curid])
        all_ids.pop(curid)
    urls = [urlf(entry, tag="i") for entry in ids]
    return [load_movie(url) for url in urls]

def fetch_movie_ids(url=TOP_URL):
    source = requests.post(url).text
    return list(set(re.findall('/title/(\w+)/', source)))

def stash_imdb_ids():
    nms = ["top", "new", "popular"]
    urls = [TOP_URL, NEW_URL, POP_URL]
    for (nm, url) in zip(nms, urls):
        ids = fetch_movie_ids(url)
        fnm = os.path.join('data', 'imdb_ids_' + nm + '.txt')
        with open(fnm, 'w') as f:
            f.write('\n'.join(ids))

def stash_imdb_objs():
    ids = get_movie_ids()
    print len(ids)
    ids = ids[:100]
    ms = [load_movie(urlf(curid, tag="i")) for curid in ids]
    fnm = os.path.join('data', 'imdb_stash.json')
    with open(fnm, 'w') as f:
        f.write(json.dumps(ms, indent=4))

def load_imdb_objs():
    fnm = os.path.join('data', 'imdb_stash.json')
    with open(fnm) as f:
        return json.load(f)

if __name__ == '__main__':
    # stash_imdb_ids()
    # print get_movie_ids()
    stash_imdb_objs()
    # print load_imdb_objs()
