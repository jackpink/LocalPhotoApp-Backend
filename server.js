var express = require('express');
var fs = require('fs');
var app = express();


const getAlbums = async () => {
    const albums = fs.readFile('albums.txt', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
        data = data.replace(/ /g, '');
        data = data.replace('[', '');
        data = data.replace(']', '');
        data = data.replace(/"/g, '');
        data = data.replace(/'/g, '');
        const albums = data.split(',');
        console.log(albums);
        return albums
    
    });
    console.log('albums to return', albums);
    return albums;
}

const getResponse = async () => {
    const albums = await getAlbums();
    const response = {
        albums: albums
    };
    return response;
}

// This responds with "Hello World" on the homepage
app.get('/albums', async function (req, res) {
   console.log("Got a GET request for local albums");
   const response = await getResponse();
   console.log('albums', response);
   res.send(response);
})

// This responds a POST request for the homepage
app.post('/albums', function (req, res) {
   console.log("Got a POST request for local albums");
   res.send('Will Create album in future');
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