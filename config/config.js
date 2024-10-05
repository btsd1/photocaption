import dotenv from 'dotenv'

dotenv.config()

import superConfig from '../config.js';

const config = {
    development: {
        username: superConfig.SUPABASE_DB_USERNAME,
        password: superConfig.pgPassword,
        database: 'postgres',
        host: superConfig.SUPABASE_DB_HOST,
        port: superConfig.pgPort,
        dialect: 'postgres'
    },
    test: {
        username: superConfig.SUPABASE_DB_USERNAME,
        password: superConfig.pgPassword,
        database: 'postgres',
        host: superConfig.SUPABASE_DB_HOST,
        port: superConfig.pgPort,
        dialect: 'postgres'
    },
    production: {
        username: superConfig.SUPABASE_DB_USERNAME,
        password: superConfig.pgPassword,
        database: 'postgres',
        host: superConfig.SUPABASE_DB_HOST,
        port: superConfig.pgPort,
        dialect: 'postgres'
    }
};


export default config;