import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
	destination: './upload/imges',
	filename: (req, file, cb)=> {
		console.log(file)
		const extention = path.extname(file.originalname)
		const fileName = file.originalname.replace(extention, "")
		// console.log(`${fileName}_${Date.now()}${extention}`)
		return cb(null, `${fileName}_${Date.now()}${extention}`)
	}
})

const upload = multer({
	storage: storage
})

export default upload