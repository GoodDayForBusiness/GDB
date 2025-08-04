import express from "express"
import dotenv from "dotenv"
dotenv.config()
import bodyParser  from "body-parser"
import mysql from "mysql2/promise"
import ejs from "ejs"
const connection = await mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'kimm97531!',
    database: 'areadb'
})

const app = express()
const port = 3030

app.set('view engine','ejs')
app.set('views','./views')
connection.connect(err => { 
    if (err) {
        console.error('❌ MySQL 연결 실패:', err.message);
    } else {
        console.log('✅ MySQL 연결 성공!');
    }
})


app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/getDB',async (req,res)=>{
    const data =  connection.execute('select * from 서울시상권분석')
    //console.log(typeof(data))
    return data
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})