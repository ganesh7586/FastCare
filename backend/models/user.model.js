import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://imgs.search.brave.com/zjggYrPkzGZQkFxTiSyfQ1n_mODljkW7U9QPAEt42OA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzkv/MDAyLzkxOC9zbWFs/bC8zZC1kZWZhdWx0/LXVzZXItcHJvZmls/ZS1hdmF0YXItY2ly/Y2xlLWljb24tcG5n/LnBuZw"
    },
    address:{
        type:Object,
        default:{line1:'',line2:''}
    },
    gender:{
        type:String,
        default:'Not Selected'
    },
    dob:{
        type:String,
        default:'Not Selected'
    },
    phone:{
        type:String,
        default:'0000000000'
    },

})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel
