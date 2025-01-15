import mongoose from "mongoose"

let MONGODB=process.env.MONGODB;
export const mongoConnection= async()=>{
    try{
        // let password = OjjI93O8KW1oCWdD
 let connect= await mongoose.connect(MONGODB);
console.log('Database connected successfully ');
console.log(connect.connection.host);
    }
    catch(error){
        console.log(`having error in mongodb connection ${error}`)
        process.exit(1)
    }
}
