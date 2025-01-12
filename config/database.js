import { connect } from 'mongoose';
require('dotenv').config();

export function connectDB() {
    connect(process.env.MONGODB_URI)
    .then(() => console.log('db connected successfully'))
    .catch((error) => {
        console.log('db connection failed');
        console.error(error);
        process.exit(1);
    });
}