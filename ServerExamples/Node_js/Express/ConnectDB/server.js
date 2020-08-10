// postgreSQLへobjectionを使用して接続する
const express = require('express')
const {Model} = require('objection')
const Knex = require('knex')
const app = express()

const knex = Knex({
    client: 'pg',
    version: '12.1',
    connection:{
        host : '127.0.0.1',
        user : 'postgres',
        password: 'mysecretpassword',
        database : 'test0'
    }
})

Model.knex(knex)

class User extends Model {
    static get tableName(){
        return 'user'
    }
}


async function main (){
    //await User.query().insert({ name: 'Hogeho',age:20})
    //result = await User.query()
    //console.log(result)
    result = await User.query().where('name','Hogeho')
    console.log(result)
}

//app.get('/', (req, res) => res.send('Hello World!'))
//
//app.listen(3000, () => console.log('Example app listening on port 3000!'))
main()