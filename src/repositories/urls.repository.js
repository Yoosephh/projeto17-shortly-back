import { db } from "../database/database.js"

export async function selectAllToken(token) {
  return await db.query(`SELECT * FROM tokens WHERE token = $1`, [token])
}

export async function selectAllUrlsId(urlId) {
  return await db.query(`SELECT * FROM "urls" where id = $1`, [urlId])
}
export async function selectAllUrlsShortUrl(shortUrl) {
  return await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl])
}

export async function updateUrls(shortUrl){
  return await db.query(`UPDATE urls SET "views" = "views" + 1 WHERE "shortUrl" = $1`, [shortUrl])
}

export async function deleteUrl(urlId) {
  return await db.query(`DELETE FROM urls WHERE id = $1`, [urlId])
}

export async function insertIntoUrls(url, shortUrl, checkUser) {
  return await db.query(`INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id`, [url, shortUrl, checkUser.rows[0].userId])
}

export async function rankUsers() {
  return await db.query(`
  SELECT
    users.id,
    users.name,
    COUNT(urls.id) AS "linksCount",
    COALESCE(SUM(urls.views), 0) AS "visitCount"
  FROM users
  LEFT JOIN urls ON users.id = urls."userId"
  GROUP BY users.id, users.name
  ORDER BY "visitCount" DESC
  LIMIT 10;
`)
}