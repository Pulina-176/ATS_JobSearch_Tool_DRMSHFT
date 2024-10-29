from app import create_app
from blueprints.ClientDetails.client_details import client_details

flask_app = create_app()

#registering routes
flask_app.register_blueprint(client_details, url_prefix='/client_data')


@flask_app.route("/")
def home():
    return "Welcome to the home page"

if __name__ == '__main__':
    flask_app.run(host='0.0.0.0', debug=True)