import { db } from "../database/database"
import {nanoid} from "nanoid"


export async function createUrl(req,res) {
  const {Authorization} = req.headers
  const {url} = req.body
  try{
    const shortUrl = nanoid(8)
  }catch (err){
    console.log(err)
  }
}

export async function sendUrl(req,res) {
  try{

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

