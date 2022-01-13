var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')

var app = express();
// create application/json parser
var jsonParser = bodyParser.json()

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });


const getAlbums = () => {
   try {
      let data = fs.readFileSync('albums.txt', 'utf8')
      console.log(data);
      data = data.replace(/ /g, '');
      data = data.replace('[', '');
      data = data.replace(']', ''); // Need to learn regex to improve this
      data = data.replace(/"/g, '');
      data = data.replace(/'/g, '');
      const albums = data.split(',');
      console.log('albums to return', albums);
      return albums;
    
    } catch(err) {
      console.log(err);
      return [];
    }
    
}

const getResponse = () => {
    const albums = getAlbums();
    const response = {
        albums: albums
    };
    return response;
}

const writeToFile = (albums) => {
   try {
      fs.writeFileSync('albums.txt', albums);
      return true;
   } catch (err) {
      console.log(err)
      return false;
   }
}

// This responds with "Hello World" on the homepage
app.get('/albums', async function (req, res) {
   console.log("Got a GET request for local albums");
   const response = getResponse();
   console.log('albums', response);
   res.send(response);
})

// This responds a POST request for the homepage
app.post('/albums', jsonParser, function (req, res) {
   console.log("Got a POST request for local albums", req.body);
   // get albums
   let albums = getAlbums()
   console.log("albums from data", albums[0]);
   // check if album exists
   const newAlbum = req.body.name
   console.log("new album name", newAlbum);
   // add to albums
   albums.push(newAlbum);
   console.log("updated list of albums", albums);
   // write to file
   const writeSuccess = writeToFile(albums.toString());
   console.log(writeSuccess);
   // return
   res.send(albums);
})

// This responds a DELETE request for the /del_user page.
app.delete('/albums', function (req, res) {
   console.log("Got a DELETE request for albums");
   res.send('Will Delete album in future');
})

// This responds a GET request for the /list_user page.
app.get('/photos', function (req, res) {
   console.log("Got a GET request for photos");
   res.send('Photos...');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.post('/photos', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Will Upload a new Photo');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})