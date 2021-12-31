import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
	fullName:{
		type:String,
	    required: true
	},
	mobile:{
		type:Number,
	    required: true
	},
	email: {
		type:String
	},
	address:{
		type:String,
	    required: true,
	},
	ImgName: {
		type: String
	},
	url: {
		type: String
	},
});


const User = new mongoose.model("userDatas", userDataSchema);
export default User;