import { db } from "../database/database.js"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

export async function signUp(req,res){
  const {name, email, password, confirmPassword} = req.body

  try{
    const checkUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email])
    if (checkUser.rowCount !== 0) return res.status(409).send("Email indisponível para uso!")

    // Verificar se senhas são iguais e criptografar a senha antes
    if(confirmPassword !== password) return res.status(422).send("A senha e a confirmação de senha devem ser iguais!");
    const cryptedPassword = bcrypt.hashSync(password, 10);

    delete req.body.password
    await db.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3)`, [name, cryptedPassword, email])
    res.status(201).send({message:"Usuário cadastrado com sucesso! :)"})
  }catch (err){
    console.log(err)
  }
}

export async function signIn(req,res){
  const {email, password} = req.body
  try{
    const checkUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email])
    if (checkUser.rowCount === 0 ||!(await bcrypt.compare(password, checkUser.rows[0].password))) return res.sendStatus(401)

    delete req.body.password

    const token = uuid();

    await db.query(`INSERT INTO tokens ("userId", token) VALUES ($1, $2)`, [checkUser.rows[0].id, token])

    res.status(200).send({message:`Seja bem vindo, ${checkUser.rows[0].name}`, token})
  }catch (err){
    console.log(err)
  }
}

export async function sendUser(req,res){
  const token = req.headers.authorization.replace("Bearer ", "")
  if (!token) return res.status(401).send({message:"Obrigatório fornecer um token"})
  try{
  const userQuery = `
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
    `;

    const result = await db.query(userQuery, [token]);

    if (result.rows.length === 0) {
      return res.status(401).send({ message: "Token fornecido é inválido" });
    }

    const { id, name, visitCount, shortenedUrls } = result.rows[0];

    const response = {
      id,
      name,
      visitCount: visitCount,
      shortenedUrls: shortenedUrls || [],
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }

}

