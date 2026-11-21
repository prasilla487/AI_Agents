import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.user,
     process.env.dbname,
    process.env.password)
const pool = new Pool({
    user: process.env.user,
    host: 'localhost',
    database: process.env.dbname,
    password: process.env.password,
    port: 5432,
    ssl: false,
    max : 20,
    idleTimeoutMillis : 30000,
    connectionTimeoutMillis : 2000
});

pool.on('connect', () => {
    console.log('[INFO] Database connected');
})

pool.on('error', (err) => {
    console.error('[Error] Unexpected Database error', err.message);
})

export async function initDB(){
    const client = await pool.connect();
    try{
        await client.query(`
            CREATE TABLE IF NOT EXISTS member_analyses(
            id SERIAL PRIMARY KEY,
            member_id VARCHAR(255),
           member_name VARCHAR(255) NOT NULL,
           member_email VARCHAR(255),
           member_title VARCHAR(255),
           member_timezone VARCHAR(100),
           fit_score INTEGER NOT NULL,
           insights JSONB,
           recommendations JSONB,
           research_data JSONB,
           analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           sent_to_slack BOOLEAN DEFAULT FALSE,
           sent_to_slack_at TIMESTAMP,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
            `)

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_member_id ON member_analyses(member_id)`)
        
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_analyzed_at ON member_analyses(analyzed_at)`)
        console.log('DB Schema initialized')
    }catch(error){
        console.error('Eroor failed to initialize db', error.message)
        throw error
    }
}

export async function saveMemberAnalysis(memberInfo , analysis , researchData){
    const client = await pool.connect();
    try{
        const result = await client.query(
            `INSERT INTO member_analyses(
            member_id,
            member_name,
            member_email,
            member_title,
            member_timezone,
            fit_score,
            insights,
            recommendations,
            research_data
            )
            VALUES ( $1 , $2, $3 , $4, $5 , $6 , $7, $8 , $9)
            RETURNING id`, 
            [
                memberInfo.id || null,
                memberInfo.name,
                memberInfo.email || null,
                memberInfo.title || null,
                memberInfo.timezone || null,
                analysis.fitScore ,
                 JSON.stringify(analysis.insights),
                 JSON.stringify(analysis.recommendations),
                 JSON.stringify(researchData),
            ]);

        console.log(`Saved analyses to DB with ID: ${result.rows[0].id}`)

        return result.rows[0].id

    }catch(error){
        console.error('Failed to save analysis to database: ', error.message)
        throw error;
    }
    finally{
        client.release();
    }

}

export async function markAsSentToSlack(analysisId) {
    const client = await pool.connect();
    try{
        const result = await client.query(
            
            `
            UPDATE member_analyses
            SET sent_to_slack=TRUE,
            sent_to_slack_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP 
            WHERE id=$1
            `,
            [analysisId]
        )

        console.log(`Updated sent_to_slack value in DB:`)

        return result

    }catch(error){
        console.error('Failed to mark as sent to Slack: ', error.message)
        throw error;
    }
    finally{
        client.release();
    }
}

export async function closeDB(){
    await pool.end();
    console.log('DB Pool closed');
}

export default pool;