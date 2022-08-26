import json
from urllib import response
from flask import Blueprint, request, redirect, render_template, after_this_request, jsonify, url_for, flash
from sqlalchemy.orm import query
from . import db
from .models import Poste, Edge
from math import sin, cos, sqrt, atan2, radians
from flask_cors import cross_origin


funcs = Blueprint("funcs", __name__)


@funcs.route("add-vertex", methods=['POST']) #mostly testing doest seve much actual purpose
def addVertex():

    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):

        body = request.json

        fplaq = body['fplaq']
        flng = body['fcoord']['x']
        flat = body['fcoord']['y']

        real_first = Poste.query.filter_by(plaq=fplaq).first()

        if real_first is None:

            n1 = Poste(plaq = fplaq, cordx = flng, cordy = flat)

        db.session.add(n1)
        db.session.commit()

        return body
    else:
        return 'Content-Type not supported!'

@funcs.route("/add-edge", methods=['POST'])
def addEdge():

    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):

        body = request.json

        fplaq = body['fplaq']

        n1 = Poste.query.filter_by(plaq=fplaq).first()

        if n1 is None:
            return 'Invalid font'


        nplaq = body['nplaq']

        n2 = Poste.query.filter_by(plaq=nplaq).first()

        if n2 is None:
            return 'invalid end'

        dist = body['distance']

        edge = Edge(node1 = n1.plaq, node2=n2.plaq, id=(str(n1.plaq) + str(n2.plaq)), distance=int(dist))
        edge2 = Edge(node1 = n2.plaq, node2=n1.plaq, id=(str(n2.plaq) + str(n1.plaq)), distance=int(dist))

        db.session.add(edge)
        db.session.add(edge2)
        db.session.commit()


        return body
    else:
        return 'Content-Type not supported!'

@funcs.route("/show-poste", methods=['GET'])
def showPoste():

    postes = Poste.query.all()

    for p in postes:
        print(f'{p.plaq} {p.cordx} {p.cordy}')

    return '200'


@funcs.route("/show-graph", methods=['GET'])
def showGraph():

    postes = Poste.query.all()
    nodes= []

    for p in postes:
        cons = Edge.query.filter_by(node1=p.plaq).all()
        node = (p.plaq, [(con.id, con.distance) for con in cons])
        nodes.append(node)



    return jsonify(nodes)

@funcs.route("/shortest-path/<f>/<n>", methods=['GET'])
def short(f, n):
    def findShortestPath(start, end, path=[], cost=0):

        path = path + [start]

        if start == end:
            return [path, cost]

        shortest = [None, 0] # None represents the shortest path and 0 the cost to perform it

        for con in Edge.query.filter_by(node1=start):
            if con.node2 not in path:
                new_path = findShortestPath(con.node2, end, path, (cost+con.distance))
                if new_path:
                    if shortest[0] is None or new_path[1] < shortest[1]:
                        shortest[0] = new_path[0]
                        shortest[1] = new_path[1]
        return shortest

    p1 = int(f)
    p2 = int(n)


    shortest = (findShortestPath(p1, p2))
    return jsonify(shortest)
    """    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):

    body = request.json

    p1 = Poste.query.filter_by(plaq=body['f']).first()
    p2 = Poste.query.filter_by(plaq=body['n']).first() """

@funcs.route("/all-paths/<f>/<n>", methods=["GET"])
def allPaths(f, n):
    def findAllPaths(start, end, path=[], paths=[], cost=0):
        path = path + [start]

        if start == end:
            pair = [path, cost]
            paths.append(pair)

        for con in Edge.query.filter_by(node1=start):
            if con.node2 not in path:
                findAllPaths(start=con.node2, end=end, path=path, paths=paths, cost=(cost + con.distance))

        return paths

    n1 = int(f)
    n2 = int(n)


    x = findAllPaths(n1, n2)
    return jsonify(x)

@funcs.route("/all-paths-limited/<f>/", methods=["GET"])
def allPathsLimited(f):

    def findAllRealPaths(start, end, limit, path=[], paths=[], cost=0, ):
        path = path + [(start.cordx, start.cordy)]

        if start.plaq == end.plaq:
            pair = [path, cost]
            paths.append(pair)

        if cost > limit:
            return None

        for con in Edge.query.filter_by(node1=start.plaq):

            node = Poste.query.filter_by(plaq = con.node2).first()

            if (node.cordx, node.cordy) not in path:
                findAllRealPaths(start=node, end=end, limit=limit,path=path, paths=paths, cost=(cost + con.distance))

        return paths


    def visitAllNeighboursLimited(start, limit):

        paths = []

        for node in Poste.query.all():

            paths_node = findAllRealPaths(start, node, limit)

            for path in paths_node:
                if path not in paths:
                    paths.append(path)

        return paths

    n1 = int(f)

    p1 = Poste.query.filter_by(plaq=n1).first()

    x = visitAllNeighboursLimited(p1, 100)
    return jsonify(x)





@funcs.route("/closest-poste/", methods=["POST"])
def closest_poste():

    print("cp ran")

    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):

        body = request.json

        lat = body['lat']
        lng = body['lng']

        reference = (float(lat), float(lng))

        def get_distance(point1, point2):
            R = 6370
            lat1 = radians(point1[0])  #insert value
            lon1 = radians(point1[1])
            lat2 = radians(point2[0])
            lon2 = radians(point2[1])

            dlon = lon2 - lon1
            dlat = lat2- lat1

            a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
            c = 2 * atan2(sqrt(a), sqrt(1-a))
            distance = R * c
            return distance

        closest = None # o poste mais perto
        shortest = 0    # distancia do poste mais perto

        for poste in Poste.query.all():

            distance = get_distance(reference, (poste.cordx, poste.cordy))

            if closest is None or distance < shortest:

                closest = poste
                shortest = distance




        pair = [closest.plaq, (closest.cordx, closest.cordy), shortest]

        print(pair)

        return jsonify(pair)
    return "invalid"
