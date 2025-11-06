from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///instance/tasks.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

db = SQLAlchemy(app)							
bcrypt = Bcrypt(app)							
jwt = JWTManager(app)							

# Models 
class User(db.Model):							
    id = db.Column(db.Integer, primary_key = True)  
    username = db.Column(db.String(80), unique = True, nullable = False)
    password = db.Column(db.String(200), nullable = False) 

class Task(db.Model):                                                   
    id = db.Column(db.Integer, primary_key = True) 
    title = db.Column(db.String(120), nullable = False) 
    description = db.Column(db.String(300)) 
    done = db.Column(db.Boolean, default = False) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False) 

if not os.path.exists('instance'):
    os.makedirs('instance')

with app.app_context():
    if not os.path.exists('instance/tasks.db'):
        db.create_all()       

# Routes
@app.route('/')
def home():
    return 'Task Manager API is running!'

@app.route('/register', methods = ['POST'])  
def register():

    data = request.get_json() or {} 
    
    if not data.get('username') or not data.get('password'):
        
        return jsonify( {'success' : False, 'message' : 'username and password required'} ), 400
    
    if User.query.filter_by(username = data['username']).first():

        return jsonify({'success' : False, 'message' : 'username already exists'}), 400
                                               
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8') 
    new_user = User(username = data['username'], password = hashed_pw) 
    db.session.add(new_user)                                         
    db.session.commit()                                              
    return jsonify({'message': 'User registered successfully'})      


@app.route('/login', methods=['POST']) 
def login():

    data = request.get_json() or {}
    
    if not data.get('username') or not data.get('password'):

        return jsonify( {'success' : False, 'message' : 'username and password required'} ), 400
    
    user = User.query.filter_by(username = data['username']).first() 
    
    if user and bcrypt.check_password_hash(user.password, data['password']): 
        
        access_token = create_access_token(identity = str(user.id))
        return jsonify({'success' : True, 'access_token' : access_token} )
    
    return jsonify( {'success' : False, 'message': 'Invalid credentials'} ), 401 

@app.route('/tasks', methods=['GET']) 
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()                                   
    tasks = Task.query.filter_by(user_id=user_id).all()            
    task_list = [{ 'id': t.id, 'title': t.title, 'description': t.description, 'done': t.done } for t in tasks] 
    return jsonify({"tasks" : task_list})

@app.route('/tasks', methods=['POST']) 
@jwt_required()
def add_task():
    data = request.get_json()                                        
    user_id = get_jwt_identity()                                    
    new_task = Task(title = data['title'], description=data.get('description', ''), user_id=user_id) 
    db.session.add(new_task)                                         
    db.session.commit()                                              
    return jsonify({'message': 'Task created'})                      

@app.route('/tasks/<int:task_id>', methods=['PUT'])  
@jwt_required()
def update_task(task_id):
    data = request.get_json()                                       
    user_id = get_jwt_identity()                                     
    task = Task.query.filter_by(id = task_id, user_id=user_id).first() 
    if not task:						     
        return jsonify({'message': 'Task not found'}), 404
    task.title = data.get('title', task.title)			     
    task.description = data.get('description', task.description)     
    task.done = data.get('done', task.done)                          
    db.session.commit()						    
    return jsonify({'message': 'Task updated'})			     

@app.route('/tasks/<int:task_id>', methods=['DELETE'])                  
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()					
    task = Task.query.filter_by(id = task_id, user_id=user_id).first()   
    if not task:							
        return jsonify({'message': 'Task not found'}), 404
    db.session.delete(task)						
    db.session.commit()							
    return jsonify({'message': 'Task deleted'})				

if __name__ == '__main__':   
    
    with app.app_context():
        db.create_all()      
    
    app.run(host = '0.0.0.0', port = int(os.getenv('PORT', 5000)))     
