const graphql = require('graphql');
const crud = require('./crud');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList } = graphql;

const AlbumType = new GraphQLObjectType({
    name: 'Album',
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        photos: {
            type: new GraphQLList(PhotoType),
            resolve(parent, args) {
                // Get photos for book
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

module.exports = new GraphQLSchema({
    query: RootQuery
});