from API import create_app
from flask_cors import CORS
import os


if __name__ == "__main__":

    
    app = create_app()
    CORS(app)
    app.run(debug=True)