## Idea

* The app server is independent from authentication server (https://github.com/kelci2017/Authentication-server)
* The app server is mainly for mobile apps
* The app server return the token to mobile apps when user login in the mobile app
* The app fetch the token from authentication server
* Everytime the mobile app call the app server with JWT token in the header
* The app server request the authentication server to verfy the token
* The app server and the authentication server has the same auth_config key
* All routes need validate the session, the session timeout is 2 days
* The session timestamp is updated evrytime when mobile app call the app server
* When mobile app fetch info from app server with sessionid in the query, userid can be found in the database, then the needed info could be returned to the mobile app
* All tables in the database can be referred by userid
* If session was timeout, the app server remove the session from database and return timeout to the mobile app


## Instructions
If you would like to download the code and try it for yourself:

* Install packages: npm install
* Launch: npm start