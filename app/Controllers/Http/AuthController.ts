import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'


export default class AuthController {
    public async signup({request,response}:HttpContextContract){
        try{
            const validatedData  = await request.validate(AuthValidator)
            const user = await User.create(validatedData)
            const time = new Date()
            const expTime =  time.getTime() + (20*60*1000)
            const token = jwt.sign(
                {data:{email:user.email, expiresIn: expTime}},
                Env.get('JWT_SECRET')
            )
            response.encryptedCookie('token',token)
            response.send(token)

        }

        catch(err){
            response.abort(err)
        }
    }
    public async login({request,response}:HttpContextContract){
        try{
            const validatedData  = await request.validate(AuthValidator)
            const user = await User.findByOrFail('email',validatedData.email)
            if(await Hash.verify(user.password,validatedData.password)){
                const time = new Date()
            const expTime =  time.getTime() + (20*60*1000)
            const token = jwt.sign(
                {data:{email:user.email, expiresIn: expTime}},
                Env.get('JWT_SECRET')
            )
            response.encryptedCookie('token',token)
            response.send(token)
            }
            else{
                response.abort('Incorrect Password')
            }
        }
        catch(err){
            response.abort(err)
        }
    }
}
