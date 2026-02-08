import requests
import json

# Test CSRF endpoint
try:
    response = requests.get('http://127.0.0.1:8000/api/auth/csrf/', headers={'Content-Type': 'application/json'})
    print('CSRF Response Status:', response.status_code)
    print('CSRF Response Content:', response.text[:500])
    if response.status_code == 200:
        print('CSRF Response JSON:')
        print(json.dumps(response.json(), indent=2))
except Exception as e:
    print('CSRF Error:', str(e))

# Test login endpoint
print('\n' + '='*50)
try:
    response = requests.post('http://127.0.0.1:8000/api/auth/login/', 
        json={'username': 'admin', 'password': 'wrong'},
        headers={'Content-Type': 'application/json'})
    print('Login Response Status:', response.status_code)
    print('Login Response Content:', response.text[:500])
except Exception as e:
    print('Login Error:', str(e))
