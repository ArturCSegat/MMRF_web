from . import db

class Poste(db.Model):
    plaq = db.Column(db.Integer, primary_key=True)
    cordx = db.Column(db.Float)
    cordy = db.Column(db.Float)



class Edge(db.Model):
    node1 = db.Column(db.Integer, db.ForeignKey('poste.plaq', ondelete='CASCADE'))
    node2 = db.Column(db.Integer, db.ForeignKey('poste.plaq', ondelete='CASCADE'))
    
    id = db.Column(db.String, primary_key = True)

    distance = db.Column(db.Integer)
