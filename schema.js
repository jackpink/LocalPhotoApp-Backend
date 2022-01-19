const graphql = require('graphql');
const crud = require('./crud');
const path = require('path');
const fs = require('fs');
const upload = require('apollo-upload-server');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLSchema, GraphQLList } = graphql;

const { GraphQLUpload } = upload;

const AlbumType = new GraphQLObjectType({
    name: 'Album',
    fields: () => ({
        name: {type:GraphQLString},
        photos: {
            type: new GraphQLList(PhotoType),
            resolve(parent, args) {
                // Get photos for album
            }
        }
    })
})

const PhotoType = new GraphQLObjectType({
    name: 'Photo',
    fields: () => ({
        name: {type:GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        album: {
            type: AlbumType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                // code to get data for mock db
               
                const result = crud.getAlbumById(args.id);
                console.log("WHAT", result);
                return result;
            }
        },
        albums: {
            type: new GraphQLList(AlbumType),
            resolve(parent, args) {
                return crud.getResponse();
            }
        }

    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAlbum: {
            type: AlbumType,
            args: {
                name: {type: GraphQLString}
            },
            resolve(parent, args) {
                console.log("to ad");
                return crud.addAlbum(args.name);
            }
        },
        uploadImage: {
            type: AlbumType,
            args: {
                image: {type: GraphQLUpload},
                //album: {type: GraphQLString}
            },
            async resolve(parent, { image }) {
                const {filename, mimetype, createReadStream } = await image
                console.log(image);
                
                const stream = createReadStream();
                const pathName = path.join(__dirname, `/uploads/${filename}`)
                console.log("creating file in path", pathName);
                console.log("album name is ", createReadStream);
                stream.on('open', async () => {
                    await stream.pipe(fs.createWriteStream(pathName));
                })
                
                
                return {
                    name: `${filename}`
                }
            }   
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});