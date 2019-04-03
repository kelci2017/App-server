## Idea

* The app server is independent from authentication server (https://github.com/kelci2017/Authentication-server)
* The app server is mainly for mobile apps
* The app server return the token to mobile apps when user login in the mobile app
* The app fetch the token from authentication server
* Everytime the mobile app call the app server with JWT token in the header
* The app server request the authentication server to verfy the token
* The app server and the authentication server has the same auth_config key
* All routes need validate the session, the session timeout is 2 days
* The session timestamp is updated everytime when mobile app call the app server
* When mobile app fetch info from app server with sessionid in the query, userid can be found in the database, then the needed info could be returned to the mobile app
* All tables in the database can be referred by userid
* If session was timeout, the app server remove the session from database and return timeout to the mobile app

### Amazon sns notification to FCM & APNS

* Amazon sns notification is in branch sns_notification
* When app server get token from apps(ios & android), it send token to amazon sns, and sns will send notifications to FCM or APNS
* Apps call app server with API regiterNotification, post the deviceid and token to server. Once token is refreshed at the app side, based on the deviceid, token will be refreshed also at the server side.
* When apps create notifications, server will send notifications to all the devices which logged in with the same user, except for the device who create notes. It means the device who create notes will not receive notifications to himself.

## Instructions
If you would like to download the code and try it for yourself:

* Install packages: npm install
* Launch: npm start
* Pls use the restclient with http://localhost:4000/ and the routes in appRouts.js with token in the header and append the sessionid in the url (the sessionid can be fetched with http://localhost:4000/auth/register)
