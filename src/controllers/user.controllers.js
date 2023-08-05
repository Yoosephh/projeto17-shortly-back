import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
import { insertIntoUsers, selectAllUsersEmail, sendUsersMe } from "../repositories/users.repository.js"

export async function signUp(req,res){
  const {name, email, password, confirmPassword} = req.body
  try{
    const checkUser = await selectAllUsersEmail(email)
    if (checkUser.rowCount !== 0) return res.status(409).send("Email indisponível para uso!")

    if(confirmPassword !== password) return res.status(422).send("A senha e a confirmação de senha devem ser iguais!");
    const cryptedPassword = bcrypt.hashSync(password, 10);

    delete req.body.password

    await insertIntoUsers(name, cryptedPassword, email)
    res.status(201).send({message:"Usuário cadastrado com sucesso! :)"})
  }catch (err){
    console.log(err)
  }
}

export async function signIn(req,res){
  const {email, password} = req.body
  try{
    const checkUser = await selectAllUsersEmail(email)
    if (checkUser.rowCount === 0 ||!(await bcrypt.compare(password, checkUser.rows[0].password))) return res.sendStatus(401)

    delete req.body.password

    const token = uuid();

    await insertIntoTokens(checkUser, token);

    res.status(200).send({message:`Seja bem vindo, ${checkUser.rows[0].name}`, token})
  }catch (err){
    console.log(err)
  }
}

export async function sendUser(req,res){
  const token = req.headers.authorization.replace("Bearer ", "")
  if (!token) return res.status(401).send({message:"Obrigatório fornecer um token"})
  try{
    const result = await sendUsersMe(token)

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

