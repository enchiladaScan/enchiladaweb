import requests
import yaml
import os

# Configuración
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
USER_ID = "AAAAAAAAAAAAAAAAAAAAAJnB3wEAAAAAMj9y%2FvfHUra6Iv3OD2LmeoABjbA%3DghUU0iaXEuJRV4vRaihLY9igfEW5kJzR56vtnIQVMbV7mslb6e" 
# ID numérico de Escan

def get_tweets():
    url = f"https://api.twitter.com/2/users/{USER_ID}/tweets?max_results=10&tweet.fields=id"
    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        tweets = response.json().get('data', [])
        return [f"https://x.com/user/status/{t['id']}" for t in tweets]
    return []

new_tweets = get_tweets()
if new_tweets:
    with open('_data/tweets.yml', 'w') as f:
        yaml.dump(new_tweets, f)