import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import BookOptionalValidator from 'App/Validators/BookOptionalValidator'
import BookValidator from 'App/Validators/BookValidator'

export default class BookController {
    
    
    public async show({response}:HttpContextContract){
        response.send(await Book.all())
    }

    public async showSingle({response,params}:HttpContextContract){
        response.send(await Book.findByOrFail('id',params.id))
    }



    public async create({request,response}:HttpContextContract){
        console.log(request.body())
        const validatedData = await request.validate(BookValidator)
        const image = request.file('image')
        if(image){
            const imageName = new Date().getTime().toString() + `.${image.extname}`
            await image.move(Application.publicPath('images'),{
                name: imageName
            })
            const book = await Book.create({
                image: `images/${imageName}`,
                ...validatedData
            })
            response.send(book)
        }

        else{
            response.abort('Image Field Required')
        }

    }


    public async update({request,response}:HttpContextContract){
        const validatedData = await request.validate(BookOptionalValidator)
        const book = await Book.findByOrFail('id',validatedData.id)
        const image = request.file('image')
        if(book){
            await book.merge(validatedData).save()    
            if(image){
            const imageName = new Date().getTime().toString() + `.${image.extname}`
            await image.move(Application.publicPath('images'),{
                name: imageName
            })            
            await book.merge({
                image: `images/${imageName}`
            }).save()
        }
        response.send(book)
        }
        
        else{
            response.abort('Invalid User')
        }


    }


    public async delete({params,response} : HttpContextContract){
        const book = await Book.findByOrFail('id',params.id)
        await book.delete()
        response.send(await Book.all()) 
    }

}
