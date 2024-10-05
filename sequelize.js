import { Sequelize } from "sequelize";
import config from './config.js'

const sequelize = new Sequelize(`postgresql://postgres.fgideclrpjutgkejlsys:${config.pgPassword}@aws-0-us-east-1.pooler.supabase.com:${config.pgPort}/postgres`)

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  //sequelize.close() CLOSES CONNECTION
  