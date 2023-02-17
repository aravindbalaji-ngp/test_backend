import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'
export default class Signup {
  public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if(request.header('token')){
    jwt.verify(request.header('token'),Env.get('JWT_SECRET'))
    await next()
    }
    else{
      response.abort('Invalid Token')
    }


  } 
}
