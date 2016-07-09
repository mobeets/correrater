import json
import os.path
import cherrypy

import conf
from model.search import find_movie, random_movies

class Root(object):
    def __init__(self):
        pass

    @cherrypy.expose
    def index(self):
        with open('static/index.html') as f:
            return f.read()

    def prep_movie(self, movie):
        print movie
        movie["rating"] = None
        movie["title"] = movie["Title"]
        movie["description"] = movie["Plot"]
        return movie

    @cherrypy.expose
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def add_movie(self):
        result = {"operation": "request", "result": "success"}
        content = cherrypy.request.json
        print content
        movie = find_movie(content["name"])
        result["movie"] = self.prep_movie(movie)
        return result

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def random_movies(self):
        NUM_MOVIES = 10
        result = {"operation": "request", "result": "success"}
        result["movies"] = [self.prep_movie(m) for m in random_movies(NUM_MOVIES)]
        return result

def main():
    cherrypy.config.update(conf.settings)

    root_app = cherrypy.tree.mount(Root(), '/', conf.root_settings)
    root_app.merge(conf.settings)

    if hasattr(cherrypy.engine, "signal_handler"):
        cherrypy.engine.signal_handler.subscribe()
    if hasattr(cherrypy.engine, "console_control_handler"):
        cherrypy.engine.console_control_handler.subscribe()
    cherrypy.engine.start()
    cherrypy.engine.block()

if __name__ == '__main__':
    main()
