const mongooose = require('mongoose');

const connectDB= async () =>{
    try {
            const conn = await mongooose.connect(process.env.MONGO_URI);
            console.log(`Connected Successfuly : ${conn.connection.host}`)
    }catch(error){
        console.error(`Error while conneting to db :${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;