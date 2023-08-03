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
    if (checkUser[0].rowCount === 0 ||!(await bcrypt.compare(password, checkUser[0].password))) return res.sendStatus(401)

    delete req.body.password

    const token = uuid();

    await db.query(`INSERT INTO tokens ("userId", token) VALUES ($1, $2)`, [checkUser.rows[0].id, token])

    res.status(200).send({message:`Seja bem vindo, ${checkUser.rows[0].name}`, token})
  }catch (err){
    console.log(err)
  }
}

export async function sendUser(req,res){
  const {token} = req.headers
  if (!token) return res.status(401).send({message:"Obrigatório fornecer um token"})
  try{
    const checkUser = await db.query(`SELECT * FROM tokens WHERE token = $1`, [token])
    if(checkUser.rowCount === 0) return res.status(401).send({message:"Token fornecido é inválido"})

    
  }catch (err){
    console.log(err)
  }
}

