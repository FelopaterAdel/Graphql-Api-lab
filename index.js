import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {resolvers} from "./resolvers.js"
import {schema} from "./schema.js"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


let server = new ApolloServer({
    typeDefs:schema,
    resolvers:resolvers,
    formatError:(err)=>{
        return {message:err.message}
    }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/graphDB")
  .then(() => {
    console.log("Connected to DG successfully");
  })
  .catch((err) => {
    console.log(err);
  });



startStandaloneServer(server, {
  listen: { port: 3000 },
  context:({req})=>{
    let {authorization} = req.headers;
    if(authorization){
        let decode =jwt.verify(authorization,process.env.SECRET)
        return decode
    }else{
        return {}
    }
  }
})
  .then(() => {
    console.log("Server started successfully.");
  })
  .catch((err) => {
    console.log(err);
  });