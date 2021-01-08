require("dotenv").config(); //ensure this stays at the top of the code

const server = require('./server.js');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));



  
