import { Sequelize } from "sequelize";
import config from './config.js'

export const sequelize = new Sequelize(`postgresql://postgres.fgideclrpjutgkejlsys:${config.pgPassword}@aws-0-us-east-1.pooler.supabase.com:${config.pgPort}/postgres`)

export const transaction = async (sqlizeCallback) => {
    try {
        const result = await sequelize.transaction(async t => {
            return await sqlizeCallback(t);
        });
        return result
        // If the execution reaches this line, the transaction has been committed successfully
        // `result` is whatever was returned from the transaction callback (the `user`, in this case)
      } catch (error) {
        console.log(`The transaction has been rolled back because of the following error: ${error}`)
        throw error;
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
      }
}

  //sequelize.close() CLOSES CONNECTION
  