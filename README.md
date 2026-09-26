# Assignment 19 - Social Media App

Backend implementation for Assignment 19 using Node.js, Express, MongoDB/Mongoose, JWT and Socket.IO.

## Included
- User registration/login + JWT authentication
- User profile and dashboard
- Connections/follow system
- CRUD for posts and comments
- News feed and profile posts
- Facebook-style emoji reactions: like, love, haha, wow, sad, angry
- Soft delete + hard delete
- Cascade deletion of post comments through Mongoose hooks
- Real-time chat with Socket.IO
- REST APIs for conversations/messages
- Health check and Render deployment configuration

## Run locally
1. Install Node.js 18+.
2. Create `.env` from `.env.example`.
3. Set `MONGO_URI` and a strong `JWT_SECRET`.
4. Run:
   npm install
   npm run dev

API base: http://localhost:3000/api/v1
Health: http://localhost:3000/health

## Main endpoints
Auth:
POST /auth/register
POST /auth/login
GET /auth/me

Users:
GET /user/dashboard
GET /user/:id
PUT /user/:id
POST /user/toggle-connection

Posts:
POST /post
GET /post/news-feed
GET /post/profile/:userId
GET /post/:id
PUT /post/:id
DELETE /post/:id
DELETE /post/:id/hard
PUT /post/:id/reaction
DELETE /post/:id/reaction

Comments:
POST /comment/:postId
GET /comment/:postId
PUT /comment/:commentId
DELETE /comment/:commentId
DELETE /comment/:commentId/hard
PUT /comment/:commentId/reaction

Chat:
POST /chat/conversations
GET /chat/conversations
GET /chat/conversations/:id
GET /chat/conversations/:id/messages

## Socket.IO
Connect with:
{ auth: { token: "<JWT>" } }

Events:
- joinConversation -> conversationId
- sendMessage -> { conversationId, text }
- newMessage -> emitted to the conversation
- typing -> { conversationId }

## Deployment
The included `render.yaml` is ready for Render. Add `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` as environment variables in the deployment dashboard.
