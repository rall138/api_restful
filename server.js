const express = require('express')
const multer = require('multer')
const app = express()
const PORT = 8080

const productosRouter = express.Router()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname+'/public'))
app.use('/api', productosRouter)

let productos = [{id:1, title:'Prod 1', thumbnail:'http://imagenes.jpg'}, {id:2, title:'Prod 2', thumbnail:'http://imagenes.jpg'}]

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

var storage = multer.diskStorage({
    
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now()+file.originalname)
    }
})

var upload = multer({storage: storage})

productosRouter.get('/productos', (req, res) =>{
    res.json(productos)
})

productosRouter.get('/productos/:id', (req, res) =>{
    let producto = productos.filter(prod => prod.id === Number(req.params.id))[0]
    if(producto !== null && producto !== undefined)
        res.json(producto)
    else
        res.json({error: 'Producto no encontrado'})
})

productosRouter.post('/productos', upload.single('thumbnail'), (req, res) =>{

    let index = productos.length > 0 ? productos[productos.length -1].id : 0;
    index++
    
    let nuevoProducto = JSON.parse(JSON.stringify(req.body))
    nuevoProducto.id = index
    delete nuevoProducto.thumbnail_url; // Elimino el campo ya que no se pide en el ejercicio
    nuevoProducto.thumbnail = req.file ? req.file.fieldname+'-'+Date.now()+req.file.originalname : req.body.thumbnail_url
    productos.push(nuevoProducto)
    res.json({message: `Producto agregado correctamente -> id:${index}`})

})

productosRouter.post('/productos/:id', (req, res) =>{
    let producto = productos.filter(prod => prod.id === Number(req.params.id))[0]
    if(producto !== null && producto !== undefined){

        let productoModificado = JSON.parse(JSON.stringify(req.body))
        productoModificado.id = producto.id

        productos[productos.indexOf(producto)] = productoModificado
        res.json({message: `Producto modificador correctamente -> id:${producto.id}`})

    }else{

        res.json({error: 'Producto no encontrado'})
    }
})

productosRouter.delete('/productos/:id', (req, res) =>{
    let producto = productos.filter(prod => prod.id === Number(req.params.id))[0]
    if(producto !== null && producto !== undefined){

        productos = productos.filter(prod => prod.id !== producto.id)
        res.json({message: `Producto eliminado correctamente -> id:${producto.id}`})

    }else{

        res.json({error: 'Producto no encontrado'})
    }
})

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
.on('error', (error) => console.log(error))