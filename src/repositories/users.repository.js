import { db } from "../database/database.js"

export async function selectAllUsersEmail(email) {
  return await db.query(`SELECT * FROM users WHERE email = $1`, [email])
}

export async function insertIntoUsers(name, cryptedPassword, email){
  return await db.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3)`, [name, cryptedPassword, email])
}

export async function insertIntoTokens(checkUser, token) {
  return await db.query(`INSERT INTO tokens ("userId", token) VALUES ($1, $2)`, [checkUser.rows[0].id, token])
}

export async function sendUsersMe(token) {
  return await db.query(`
  SELECT
    users.id,
    users.name,
    COALESCE(SUM(urls.views), 0) AS "visitCount",
    JSON_AGG(JSON_BUILD_OBJECT('id', urls.id, 'shortUrl', urls."shortUrl", 'url', urls.url, 'visitCount', urls.views)) AS "shortenedUrls"
  FROM tokens
  JOIN users ON tokens."userId" = users.id
  JOIN urls ON users.id = urls."userId"
  WHERE tokens.token = $1
  GROUP BY users.id, users.name;
`, [token])
}