import Route from '@ioc:Adonis/Core/Route'

Route.post('/signup','AuthController.signup')
Route.post('/login','AuthController.login')
Route.post('/refresh','AuthController.refresh').middleware('signup')


Route.group(()=>{
  Route.get('/','BookController.show')
  Route.get('/:id','BookController.showSingle').where('id',Route.matchers.number())
  Route.post('/','BookController.create')
  Route.put('/:id','BookController.update').where('id',Route.matchers.number())
  Route.delete('/:id','BookController.delete').where('id',Route.matchers.number())
})
