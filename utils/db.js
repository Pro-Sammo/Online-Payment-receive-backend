import mongoose from 'mongoose'

const connectDB = () =>{
  mongoose.connect(process.env.MONGODB_URL,{
        dbName:"fpi"
    }).then(()=>{
        console.log("Database is connected")
    }).catch((error)=>{
        console.log(error)
    })
}

export default connectDB