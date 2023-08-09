const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username:{
    type:String,
    require:[true,"username is required"], 
    unique:true,
  },
  parent_id: {
    type: String,
    required: [true, "parent id is required"],
  },

  name:{
     type:String,
     required:[true,"Name is required"],

  },
  password:{
    type:String,
    required:[true,"password is required"],
  },
  upline_id:{
    type: String,
    required: [true, "upline id is required"],

  },
  mobile:{
    type:Number,
    required: [true, "mobile number is required"],

  },
 
  email:{
    type:String,
    required:[true,"email is required"],

  },
  address:{
    type:String,
    required:[true,"address is required"],

  },
  state:{
    type:String,
    required:[true,"state is required"],

  },
  country:{
    type:String,
    required:[true,"Country is required"],

  },
  pin:{
    type:Number,
    required:[true,"Pin code is required"],

  },
  pan:{
    type:String,
    default:"",
  },
  left_child_id: {
    type: String, // Change to ObjectId
    default: "",
  },
  right_child_id: {
    type: String, // Change to ObjectId
    default: "",
  },
  left_count: {
    type: Number,
    description: 'total left node',
    default: 0,
  },
  right_count: {
    type: Number,
    description: 'total right node ',
    default: 0,
  },
  u_left_count: {
    type: Number,
    description: 'total user left node',
    default: 0,
  },
  u_right_count: {
    type: Number,
    description: 'total user right node',
    default: 0,
  },
  is_active_user:{
    type :Boolean,
    description:'is user active or not',
    default:false
  },
  amount:{
    type:Number,
    description:"initally the joining amount",
    default:0
  }
},
{
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
