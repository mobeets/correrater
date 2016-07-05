import json
import os.path
import cherrypy

import conf
from model.search import find_movie

class Root(object):
    def __init__(self):
        pass

    @cherrypy.expose
    def index(self):
        with open('static/index.html') as f:
            return f.read()

    @cherrypy.expose
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def add_movie(self):
        print "HERE"
        print "------------"
        result = {"operation": "request", "result": "success"}
        content = cherrypy.request.json
        print content
        movie = find_movie(content["name"])
        movie["rating"] = None
        movie["title"] = movie["Title"]
        movie["description"] = movie["Plot"]
        result["movie"] = movie
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
