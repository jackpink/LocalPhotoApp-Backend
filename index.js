const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
    GraphQLUpload,
    graphqlUploadExpress, // A Koa implementation is also exported.
  } = require('graphql-upload');
const path = require('path');
const { finished } = require('stream/promises');
const crud = require("./crud");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  scalar Upload
  # This "Book" type defines the queryable fields for every book in our data source.
  
  #input AlbumInput {
  #  name: String
  #}
  
  type Album {
    name: String,
    photos: [Photo]
  }
  
  type Photo {
    url: String
  }


  #input Albums {
  #  albums: [AlbumInput]
  #}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    allAlbums: [Album],
    photosByAlbumName(names: [String]): [Photo]
   # photos(albums: Albums): [Photo]
  }


  type Mutation {
      addAlbum(name: String): Album,
      addPhoto(image: Upload, album: String): Photo
  }
`;
  

  // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Upload: GraphQLUpload,

    Query: {
      allAlbums: () => crud.getResponse(),
      photosByAlbumName: (parent, { names }) => crud.getPhotos(names)
      //photos: (parent, { album }) => crud.getPhotos(album),
    },

    Album: {
      photos: (album) => crud.getPhotosForAlbum(album.name)
    },

    Mutation: {
        addAlbum: (parent, { name }) => {
            return crud.addAlbum(name);
        },
        addPhoto: async (parent, { image, album }) => {
            console.log(image);
            const { filename, mimetype, encoding, createReadStream } = await image;
            const pathName = path.join(`/home/jack/Documents/Projects/LocalPhotoApp/LocalPhotoApp/public/uploads/${album}/${filename}`)
            console.log(album)
            const stream = createReadStream();
            const out = require('fs').createWriteStream(pathName);
            stream.pipe(out);
            await finished(out);
            return { filename };
        }
    }
  };
  

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const startServer = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();

    const app = express();

    // This middleware should be added before calling `applyMiddleware`.
    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app });

    await new Promise(r => app.listen({ port: 4000 }, r));

    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();