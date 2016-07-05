import json
import urllib

DEFAULT_OPTS = {"type": "movie", "tomatoes": True, "plot": "short", "r": "json", "y": ""}

def urlf(query, opts=DEFAULT_OPTS):
    opts["t"] = query
    return "http://www.omdbapi.com/?{query}".format(query=urllib.urlencode(opts))

def find_movie(name):
    return json.load(urllib.urlopen(urlf(name)))
