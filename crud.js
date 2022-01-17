const { response } = require('express');
var fs = require('fs');
var _ = require("lodash");


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
    let response = {albums: []};
    albums.map((album, index) => {
      const albumJSON = {
         id: index,
         name: album
      };
      response.albums.push(albumJSON);
    })
    console.log(response);
    return response.albums;
}

const getAlbumById = (idQuery) => {
   console.log("here", idQuery)
   const response = getResponse().albums;
   console.log("geting search", response);
   const result = _.find(response, {id: parseInt(idQuery)});
   console.log("return result", result);
   return result;
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

module.exports = { getAlbumById, getResponse }