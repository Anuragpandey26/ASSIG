import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
   name : {
        type : String,
        required : [true,"Provide name"]
    },
     username: {
      type: String,
      required: true,
    },
    email : {
        type : String,
        required : [true, "provide email"],
        unique : true
     },
    password : {
        type : String,
        required : [true, "provide password"]
     },
     mobile : {
        type : Number,
        default : null
    },
    headline: {
        type: String,
        default: ""
    },
    curr_company: {
        type: String,
        default: ""
    },
    curr_location: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    },
    cover_pic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOpm5lZE1_1YKQrn9Crh9ch7wr1pSUttjERA&s"
    },
    about: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: [
        {
            designation: {
                type: String,
            },
            company_name: {
                type: String,
            },
            duration: {
                type: String,
            },
            location: {
                type: String,
            },
        }
    ],
},{timestamps:true});

const User = mongoose.model('User', UserSchema);
export default User;