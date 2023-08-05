import {nanoid} from "nanoid"
import { insertIntoUrls, rankUsers, selectAllToken, selectAllUrlsId, selectAllUrlsShortUrl, updateUrls, } from "../repositories/urls.repository.js"


export async function createUrl(req,res) {
  const token = req.headers.authorization.replace("Bearer ", "")
  const {url} = req.body
  try{
    const checkUser = await selectAllToken(token)

    if (checkUser.rowCount === 0) return res.sendStatus(401)

    const shortUrl = nanoid(8)

    const obj = await insertIntoUrls(url, shortUrl, checkUser)

    res.status(201).send({id: obj.rows[0].id, shortUrl})
  }catch (err){
    console.log(err)
  }
}

export async function sendUrl(req,res) {
  const {id:urlId} = req.params
  try{
    const checkUrl = await selectAllUrlsId(urlId)
    if(checkUrl.rowCount === 0) return res.sendStatus(404)
    const { id, shortUrl, url} = checkUrl.rows[0]
    res.status(200).send({id, shortUrl, url})
  }catch (err){
    console.log(err)
  }
}

export async function redirectUser(req,res) {
  const {shortUrl} = req.params
  try{
    const checkUrl = await selectAllUrlsShortUrl(shortUrl)

    if(checkUrl.rowCount === 0) return res.sendStatus(404)

    await updateUrls(shortUrl)
    res.redirect(checkUrl.rows[0].url)
  }catch (err){
    console.log(err)
  }
}

export async function deleteUrl(req,res) {
  const {id:urlId} = req.params
  const token = req.headers.authorization.replace("Bearer ", "")
  if(!token) return res.status(401).send({message:"Envio do token é obrigatório"})
  try{
    const checkToken = await selectAllToken(token)
    if (checkToken.rowCount === 0) return res.sendStatus(401)

    const checkUrl = await selectAllUrlsId(urlId)

    if(checkUrl.rowCount === 0) return res.sendStatus(404)

    if(checkUrl.rows[0].userId !== checkToken.rows[0].userId) return res.status(401).send({message: "Não é possível deletar uma URL que não pertence ao usuário informado"})

    deleteUrl(urlId)
    return res.status(204).send({message:"Url excluída com sucesso!"})
  }catch (err){
    console.log(err)
  }
}

export async function rankUrls(req,res){
  try{
    const result = await rankUsers();
    const rankedUsers = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      linksCount: row.linksCount,
      visitCount: row.visitCount,
    }));

    res.status(200).send(rankedUsers)
  }catch (err){
    console.log(err)
  }
}
