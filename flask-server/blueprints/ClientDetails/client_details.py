from flask import Blueprint, render_template, redirect, jsonify
from flask import request
from models.Client_model import Clientdata
from app import db

client_details = Blueprint('client_details', __name__)

@client_details.route('/', methods=['POST'])
def send_client_details():
    data = request.json
    new_client = Clientdata(
        name=data['name'],
        job_roles=data['job_roles'],
        job_locations=data['job_locations'],
        job_fields=data['job_fields']
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.to_dict()), 201

    



