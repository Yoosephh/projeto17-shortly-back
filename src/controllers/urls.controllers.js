import { db } from "../database/database.js"
import {nanoid} from "nanoid"


export async function createUrl(req,res) {
  const token = req.headers.authorization.replace("Bearer ", "")
  const {url} = req.body
  try{
    const shortUrl = nanoid(8)
    const checkUser = await db.query(`SELECT * FROM tokens WHERE token = $1`, [token])
    if (checkUser.rows.length === 0) return res.status(401)

    const obj = await db.query(`INSERT INTO urls ("URLs", "shortenedURL", "userId") VALUES ($1, $2, $3) RETURNING id`, [url, shortUrl, checkUser.rows[0].userId])

    res.status(201).send({id: obj.rows[0].id, shortUrl})
  }catch (err){
    console.log(err)
  }
}

export async function sendUrl(req,res) {
  const {id:urlId} = req.params
  try{
    const checkUrl = await db.query(`SELECT * FROM "urls" where id = $1`, [urlId])
    if(checkUrl.rowCount === 0) return res.sendStatus(404)

    const { id, shortUrl, URLs:url} = checkUrl.rows[0]
    res.status(200).send({id, shortUrl, url})

  }catch (err){
    console.log(err)
  }
}

export async function redirectUser(req,res) {
  try{

  }catch (err){
    console.log(err)
  }
}

export async function deleteUrl(req,res) {
  try{

  }catch (err){
    console.log(err)
  }
}

