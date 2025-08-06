from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///tasks.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(300))
    done = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Routes
@app.route('/register', methods=['POST'])  #Used for registering new user.
def register():
    data = request.get_json() # getting data in json format
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8') #Storing Password as hash with utf-8 
    new_user = User(username = data['username'], password=hashed_pw) #username and password for new user
    db.session.add(new_user) #Adds the new User
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})  #return message after successfull registration of New User.


@app.route('/login', methods=['POST']) #Used for Login
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/tasks', methods=['GET']) #Used for displaying id, title, description
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([{ 'id': t.id, 'title': t.title, 'description': t.description, 'done': t.done } for t in tasks])

@app.route('/tasks', methods=['POST']) #Used for Creating Tasks
@jwt_required()
def add_task():
    data = request.get_json()
    user_id = get_jwt_identity()
    new_task = Task(title=data['title'], description=data.get('description', ''), user_id=user_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created'})

@app.route('/tasks/<int:task_id>', methods=['PUT']) #Used for Updating Tasks
@jwt_required()
def update_task(task_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.done = data.get('done', task.done)
    db.session.commit()
    return jsonify({'message': 'Task updated'})

@app.route('/tasks/<int:task_id>', methods=['DELETE']) #Used for Deleting Tasks
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
