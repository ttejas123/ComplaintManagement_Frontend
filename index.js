import fetch from 'node-fetch'
import express from 'express'
import mongoose from 'mongoose';
const app = express();
// const fetch = require('node-fetch');
import fs from 'fs'
import fileUpload from './fileUpload.js'
import cors  from 'cors';
const port = process.env.PORT || 3001;
//provide schema for dataBase
import userModel  from "./models/UserData.js"
import dotenv from 'dotenv'
import Images from './models/imagesSchema.js'
dotenv.config()

// const fetch = require('node-fetch')

app.use(express.json())
app.use('', express.static('upload/imges'))
app.use(cors());

// mongoose.connect("mongodb+srv://Tejas_Thakare:Tejas@123@crud.1kyta.mongodb.net/userCurd?retryWrites=true&w=majority",{
// 	 useNewUrlParser: true,
// 	 useUnifiedTopology: true,
// })

mongoose.connect("mongodb://localhost/sub", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection
db.on('error', (error) => console.error("Error Occure ----> "+ error))
db.once('open', ()=> console.log('connected to database'))

//get all info of specific doc by ID Middalware
async function getSubscriber(req, res, next) {
	let subscriber
	try {
		subscriber = await userModel.findById(req.params.id)
		if (subscriber == null) {
			return res.status(404).json({message: "Can't find subscriber"})
		}

	} catch (e) {
		return res.status(500).json({message: e.message})
	}
	res.subscriber = subscriber
	next()
}

app.get('/', async (req, res)=>{
	res.send("We are here");
})

//insert Data in DataBase  fileUpload.single('photoimg')
app.post('/insert', fileUpload.single('photoimg'), async (req, res)=>{

	const fullNameD = req.body.fullName;
	const mobileD = req.body.mobile;
	const emailD = req.body.email;
	const addressD = req.body.address;
	const val = req.file;
	const user = new userModel({
		fullName: fullNameD,
		mobile:mobileD,
		email: emailD,
		address: addressD,
		ImgName: val.originalname,
		url: val.filename
	})

	const imgSave = new Images({
		name: val.originalname,
	 	url: val.filename,
	 	size: val.size,
	 	ext: val.mimetype
	})

	console.log(imgSave)
	// res.status(201).json(user)
	try{
	   const newSubscriber = await user.save()
	   const img  = await imgSave.save()
	   res.status(201).json(newSubscriber)
	}catch(err){
		console.log(err);
	}
})

app.post('/update', fileUpload.single('photoimg'), async (req, res)=>{
	const updateId = req.body._id;
	// console.log(updateId)
	const fullNameD = req.body.fullName;
	const mobileD = req.body.mobile;
	const emailD = req.body.email;
	const addressD = req.body.address;
	const val = req.file;
	const imgSave = new Images({
		name: val.originalname,
	 	url: val.filename,
	 	size: val.size,
	 	ext: val.mimetype
	})
	const img  = await imgSave.save()
	// console.log(imgSave)
	try{
	   await userModel.updateOne({_id:`${updateId}`}, {$set: {
		fullName: fullNameD,
		mobile:mobileD,
		email: emailD,
		address: addressD,
		ImgName: val.originalname,
		url: val.filename
	   }});
	   res.send("Data is Updated");
	}catch(err){
		console.log(err);
	}
})

app.post('/updateWOImg', async (req, res)=>{
	const updateId = req.body._id;
	const fullNameD = req.body.fullName;
	const mobileD = req.body.mobile;
	const emailD = req.body.email;
	const addressD = req.body.address;
	const val = req.file;
	try{
	   await userModel.updateOne({_id:`${updateId}`}, {$set: {
		fullName: fullNameD,
		mobile:mobileD,
		email: emailD,
		address: addressD,
		ImgName: req.body.ImgName,
		url: req.body.url
	   }});
	   res.send("Data is Updated");
	}catch(err){
		console.log(err);
	}
})

//delete Data from dataBase
app.post('/delete', async (req, res)=>{
	const deleteId = req.body.deleteId;
	try{
	   await userModel.deleteMany({_id:deleteId})
	   res.send("Data is Deleted");
	}catch(err){
		console.log(err);
	}
})
//read data from dataBase
app.get('/read', async (req, res)=>{
	userModel.find({}, (err, result)=>{
		if(err){
			res.send(err);
		}
		res.send(result);
	})
})

app.patch('/readOne/:id', getSubscriber, async (req, res)=>{
	res.json(res.subscriber)
})


import imagesRouter from './imagesRoutes.js'
app.use('/images', imagesRouter)

app.listen(port, ()=>{
	console.log("server is runing on "+port);
})