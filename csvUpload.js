import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
	destination: './upload/csv',
	filename: (req, file, cb)=> {
		//console.log(file)
		//const stream = fs.createReadStream(file)
		const extention = path.extname(file.originalname)
		const fileName = file.originalname.replace(extention, "")
		return cb(null, `${Date.now()}${extention}`)
	}
})

const upload = multer({
	storage: storage
})

module.exports = upload