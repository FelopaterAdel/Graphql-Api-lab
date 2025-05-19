import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const usersSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username must be provided."],
        unique: true,
        minLength:[8,'Username must be at least 8 characters.']
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email must be provided."],
        validate:{
            validator:function(v){
                return /^[a-zA-Z]{3,8}(@)(gmail|yahoo)(.com)$/.test(v)
            },
            message:()=>"email is not valid"
        }
    },
    password:{
        type:String,
        required:[true,"Password must be provided."],
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:"user"
    },
   },{
        timestamps: true
})


usersSchema.pre('save',async function(next){

    const salt = await bcrypt.genSalt(10);
    let hashedPassword=  await bcrypt.hash(this.password,salt);
    this.password= hashedPassword;
    next()
})

const userModel=mongoose.model('User',usersSchema);
export default  userModel;