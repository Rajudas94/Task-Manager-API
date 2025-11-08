from application import app

def test_home_route():
    response = app.test_client().get('/')
    assert response.status_code == 200
    assert b"Task Manager API is running" in response.data

