import mongoose from 'mongoose'

const connectDB = () =>{
    mongoose.connect('mongodb://127.0.0.1:27017',{
        dbName:"fpi"
    }).then(()=>{
        console.log("Database is connected")
    }).catch((error)=>{
        console.log(error)
    })
}

export default connectDB