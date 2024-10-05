import dotenv from 'dotenv'

dotenv.config()

export default {
    pgPassword: process.env.SUPABASE_DB_PW,
    pgPort: process.env.SUPABASE_DB_PORT,
    SUPABASE_DB_HOST: process.env.SUPABASE_DB_HOST,
    SUPABASE_DB_USERNAME: process.env.SUPABASE_DB_USERNAME,
    PORT: process.env.PORT,
    SUPABASE_API_URL: process.env.SUPABASE_API_URL,
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY
}