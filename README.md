# TweetCloneBackend

## Structure
- "models" stores different schemas: User, Tweet, Chat, Message//
- "routes" stores different routers and their API endpoints//
- "controller" stores different functions that control endpoints' behavior//
- "tests" stores unit tests to different API endpoints//

## To run the project
- The projects runs on localhost:8000.
- To link to the database, please use the following uri: [mongodb+srv://piaoxuanyi2001:WB15xzahGCEZXf8a@twitterclonecluster.hi1vdpl.mongodb.net/?retryWrites=true&w=majority]
- To run the unit tests, please run `npm test -- <filename>`. Please don't run all test files simultaneously as it will probably cause an exceed in time.

## HTTP Requests
> Auth
  >> signUp \
    method: POST \
    uri: http://localhost:8000/api/auths/signup/ \
    body: {username, email, password} \
  
  >> signIn \
    method: POST \
    uri: http://localhost:8000/api/auths/signin/ \
    body: {email, password} \
    
  >> cancelAccount \
    method: DELETE \
    uri: http://localhost:8000/api/auths/ \

> User
  >> getUser \
    method: GET \
    uri: http://localhost:8000/api/users/find/:id/ \
  
  >> updateUser \
    method: PUT \
    uri: http://localhost:8000/api/users/:id/ \
    body: {username, email} \

> Tweets
  >> getTweet \
    method: GET \
    uri: http://localhost:8000/api/tweets/:id/ \
    
  >> createTweet \
    method: POST \
    uri: http://localhost:8000/api/tweets/ \
    body: {text} \
    
  >> updateTweet \
    method: PUT \
    uri: http://localhost:8000/api/tweets/:id/ \
    body: {text} \
    
  >> deleteTweet \
    method: DELETE \
    uri: http://localhost:8000/api/tweets/ 
    
  >> retweet \
    method: POST \
    uri: http://localhost:8000/api/tweets/:id/retweet/ \
    
  >> likeOrUnlike \
    method: PUT \
    uri: http://localhost:8000/api/tweets/:id/like/ \
    
> Chats
  >> createChat \
    method: POST \
    uri: http://localhost:8000/api/chats/:id/ \
    
  >> deleteChat \
    method: DELETE \
    uri: http://localhost:8000/api/chats/:id/ \
    
  >> getMessage \
    method: GET \
    uri: http://localhost:8000/api/chats/:id/message/ \
    
  >> sendMessage \
    method: POST \
    uri: http://localhost:8000/api/chats/:id/message/ \
