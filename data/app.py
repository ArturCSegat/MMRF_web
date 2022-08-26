from API import create_app
from flask_cors import CORS
import os


if __name__ == "__main__":


    app = create_app()
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(debug=True)
