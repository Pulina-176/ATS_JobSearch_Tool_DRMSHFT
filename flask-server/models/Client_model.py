from app import db

class Clientdata(db.Model):  
    __tablename__ = 'clientdata'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    job_roles = db.Column(db.Text, nullable=False)
    job_locations = db.Column(db.Text, nullable=False)
    job_fields = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "client id": self.id,
            "client name": self.name,
            "job roles": self.job_roles.split(','),  # Convert to list
            "locations": self.job_locations.split(','),
            "industries": self.job_fields.split(',')
        }