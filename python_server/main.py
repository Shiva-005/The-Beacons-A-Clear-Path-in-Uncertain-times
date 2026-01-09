from threading import Thread
from app import mira_app    
from app2 import mood_app     

def run_mira():
    mira_app.run(port=5000, debug=True, use_reloader=False)

def run_mood():
    mood_app.run(port=5001, debug=True, use_reloader=False)

if __name__ == "__main__":  
    print("🚀 Starting both Flask servers...")

    t1 = Thread(target=run_mira)
    t2 = Thread(target=run_mood)

    t1.start()
    t2.start()

    t1.join()
    t2.join()
# from app import mira_app
# from app2 import mood_app 
# from werkzeug.middleware.dispatcher import DispatcherMiddleware

# # Ye line Gunicorn ko batati hai ki main app 'mira_app' hai
# # Aur '/mood' likhne par 'mood_app' khulegi
# app = DispatcherMiddleware(mira_app, {
#     '/mood': mood_app
# })

# if __name__ == "__main__":
#     # Local machine par test karne ke liye
#     from werkzeug.serving import run_simple
#     print("🚀 Servers combined! Mira at / and Mood at /mood")
#     run_simple('0.0.0.0', 5000, app, use_reloader=True)