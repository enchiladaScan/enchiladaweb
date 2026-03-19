import requests
import yaml
import os

# Configuración
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
USER_ID = "1463321605333155845" # El ID numérico de @EnchiladaScan
def get_tweets():
    url = f"https://api.twitter.com/2/users/{USER_ID}/tweets?max_results=10&tweet.fields=id"
    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            tweets = response.json().get('data', [])
            return [f"https://x.com/user/status/{t['id']}" for t in tweets]
        else:
            print(f"Error en API: {response.status_code}")
    except Exception as e:
        print(f"Error de conexión: {e}")
    return []

new_tweets = get_tweets()
if new_tweets:
    # Asegúrate de que la carpeta _data exista localmente antes de probar
    with open('_data/tweets.yml', 'w') as f:
        yaml.dump(new_tweets, f)