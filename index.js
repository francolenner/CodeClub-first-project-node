const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json()) 
/*
        - Query params => meusite.com/users?name=franco&age=17 // FILTROS
        - Route params => users/2 // BUSCA, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
        - Request Body => { "name": "Franco", "age": 17}

        - GET           => Busca informação no back-end
        - POST          => Cria informação no back-end
        - PUT / PATCH   => Altera/Atualiza informação no back-end
        - DELETE        => Deleta informação no back-end

        - Middleware    => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
*/

/* NUNCA faça isso na vida real, só está sendo utilizada para entender -> const users = [] */
const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)
    /*
        find = (encontra a informação que vc quer dentro do array e assim que encontrar ele vai te retornar)
        findIndex = (ele vai retornar o local do array que está a sua informação)

    */
    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {

    return response.json(users) 
})

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user) 
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser) 
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json() 
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})

// npm run dev