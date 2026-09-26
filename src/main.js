require('dotenv').config();
const http=require('http');
const app=require('./lib/server');
const config=require('./config');
const db=require('./lib/database');
require('./models/postHooks');
require('./models/userHooks');
const initSocket=require('./lib/socket');

const server=http.createServer(app);
initSocket(server);

(async()=>{
 try{
  await db.connect(config.mongoUri);
  server.listen(config.port,()=>console.log(`Server running on http://localhost:${config.port}`));
 }catch(e){console.error(e);process.exit(1);}
})();
