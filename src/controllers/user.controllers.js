import { db } from "../database/database"
import bcrypt from "bcrypt"

export async function signUp(){
  const {name, email, password, confirmPassword} = req.body

  try{
    if(confirmPassword !== password) return res.status(422).send("A senha e a confirmação de senha devem ser iguais!");

    const cryptedPassword = bcrypt.hashSync(password, 10);

    delete req.body.password
    await db.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3)`, [name, cryptedPassword, email])

    res.status(201).send("Usuário cadastrado com sucesso! :)")
  }catch (err){
    console.log(err)
  }
}

export async function signIn(){
  try{

  }catch (err){
    console.log(err)
  }
}

export async function sendUser(){
  try{

  }catch (err){
    console.log(err)
  }
}

