const { response } = require('express');
var fs = require('fs');
var _ = require("lodash");
const multer = require('multer');
const path = require('path');

const fileStorageEngine = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './uploads')
   },
   filename: (req, file, cb) => {
      cb(null, Datenow() + "--" + file.originalname);
   }
});

const upload = multer({storage: fileStorageEngine})


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
    albums.map((album) => {
      const albumJSON = {
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
      console.log("ALBUMS",albums);
      fs.writeFileSync('albums.txt', albums.toString());
      return true;
   } catch (err) {
      console.log(err)
      return false;
   }
}

const createPathForAlbum  = (name) => {
   try {
      console.log(path.join(__dirname, '../'));
      const pathName = path.join(__dirname, '../', `/LocalPhotoApp/public/uploads/${name}`);
      return fs.mkdirSync(pathName, {recursive: true});
   } catch (err) {
      console.log("Could not create path for album", err);
   }
}

const addAlbum = (name) => {
   console.log("adding album ", name);
   let albums = getAlbums();
   albums.push(name);
   const result = writeToFile(albums);
   createPathForAlbum(name);
   return { name: name };
   
} 

const getPhotosForAlbum = (album) => {
   const pathName = path.join(__dirname, '../', `/LocalPhotoApp/public/uploads/${album}`);
   //loop and get photos in folder, return urls?
   const filenames = fs.readdirSync(pathName);
   let photos = [];
   let url, photo;
   filenames.forEach(file => {
      url = path.join(`uploads/${album}/${file}`);
      photo = {url: url};
      photos.push(photo);
   });
   console.log("urls", photos);
   return photos;
}

const getPhotos = (albums) => {
   let photos;
   albums.forEach((album) => {
      photos = getPhotosForAlbum(album);
   });
   return photos;
}

module.exports = { getAlbumById, getResponse, addAlbum, getPhotosForAlbum, getPhotos }