import 'dotenv/config'

export const dbConfig = {
    server: process.env.SERVER_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    driver: 'msnodesqlv8',
    trustServerCertificate: true
};