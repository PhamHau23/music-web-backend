import 'dotenv/config'

export const dbConfig = {
    server: process.env.DB_SERVER_NAME,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    driver: 'msnodesqlv8',
    trustServerCertificate: true
};