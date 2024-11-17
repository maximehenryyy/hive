import sys
import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

def search_username(username):
    sites = {
        'YouTube': f'https://www.youtube.com/@{username}',
        'Twitter': f'https://twitter.com/{username}',
        'Instagram': f'https://instagram.com/{username}',
        'TikTok': f'https://tiktok.com/@{username}',
        'Twitch': f'https://twitch.tv/{username}',
        'LinkedIn': f'https://linkedin.com/in/{username}'
    }
    
    results = []
    
    def check_url(site_name, url):
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                return {
                    'platform': site_name.lower(),
                    'username': username,
                    'url': url,
                    'exists': True
                }
        except:
            pass
        return None
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {
            executor.submit(check_url, site_name, url): site_name 
            for site_name, url in sites.items()
        }
        
        for future in as_completed(future_to_url):
            result = future.result()
            if result:
                results.append(result)
    
    return results

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 search_profiles.py <username>")
        sys.exit(1)
        
    username = sys.argv[1]
    results = search_username(username)
    print(json.dumps(results))