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

db = SQLAlchemy(app)							# Have Used SQLAlchemy as db 
bcrypt = Bcrypt(app)							# Have Used Bcrypt for hashing passwords
jwt = JWTManager(app)							# Have used JWTManager for authentication and authorization   

# Models 
# Schema of the databases used in this application
class User(db.Model):							#User db will have id, username and password fields 
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Task(db.Model):                                                   #Task db will have id, title, description, status and user id fields
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(300))
    done = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Routes
@app.route('/register', methods=['POST'])  #Used for registering new user.
def register():
    data = request.get_json()                                        # getting data in json format
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8') #Storing Password, and since password can't be stored in plain text format, its encoded with utf-8
    new_user = User(username = data['username'], password=hashed_pw) #username and password for new user
    db.session.add(new_user)                                         #Adds the new User
    db.session.commit()                                              # Make changes to the database 
    return jsonify({'message': 'User registered successfully'})      #return message after successfull registration of New User.


@app.route('/login', methods=['POST']) #Used for Login
def login():
    data = request.get_json()                            	   #getting data in Json format
    user = User.query.filter_by(username=data['username']).first() #searching for username in db
    if user and bcrypt.check_password_hash(user.password, data['password']): #If username and password matches
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    return jsonify({'message': 'Invalid credentials'}), 401 #if username and password doesn't match, return this message with the error 401 response

@app.route('/tasks', methods=['GET']) #Used for listing tasks by displaying their id, title and task description
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()                                   # getting unique user id
    tasks = Task.query.filter_by(user_id=user_id).all()            #getting task/s based on user id 
    return jsonify([{ 'id': t.id, 'title': t.title, 'description': t.description, 'done': t.done } for t in tasks]) #iterating in task/s and displaying which task/s are done by their respective id's, description and title

@app.route('/tasks', methods=['POST']) #Used for Creating Tasks
@jwt_required()
def add_task():
    data = request.get_json()                                        #Get Data in Json Format
    user_id = get_jwt_identity()                                     #Get User Id
    new_task = Task(title=data['title'], description=data.get('description', ''), user_id=user_id) #get title and description of the new task from data field
    db.session.add(new_task)                                         #Record the new task in the database
    db.session.commit()                                              #Save the Changes
    return jsonify({'message': 'Task created'})                      #Return message after successful addition of the new task

@app.route('/tasks/<int:task_id>', methods=['PUT'])  #Used for Updating Tasks
@jwt_required()
def update_task(task_id):
    data = request.get_json()                                        #Getting Data in Json Format
    user_id = get_jwt_identity()                                     #Get User Id
    task = Task.query.filter_by(id=task_id, user_id=user_id).first() # will return from the Task db if task id and user id matches
    if not task:						     # if task isnt available in db, it will return "Task Not Found message", with a error 404 not found response code
        return jsonify({'message': 'Task not found'}), 404
    task.title = data.get('title', task.title)			     # will update the current title, with the updated title
    task.description = data.get('description', task.description)     # will update the current description, with the updated title
    task.done = data.get('done', task.done)                          # will update the status, with the updated status
    db.session.commit()						     # will make all the changes to the db.
    return jsonify({'message': 'Task updated'})			     # will return a "Task Updated Successfully message

@app.route('/tasks/<int:task_id>', methods=['DELETE'])                  #Used for Deleting Tasks
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()					# Getting user id
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()    # checking if task exist on Task db for the passed task id and user id
    if not task:							# if not present, will return the "Task Not Found" message, and return a 404 error response
        return jsonify({'message': 'Task not found'}), 404
    db.session.delete(task)						# if found in db, it will remove the required task
    db.session.commit()							# Save changes to the Task db
    return jsonify({'message': 'Task deleted'})				# Return "Task deleted Successfully" message

if __name__ == '__main__':   
    with app.app_context():
        db.create_all()      # create the databases Task and User, Task will record all information of task and user will contain all info for users
    app.run(debug=True)      # run the app
