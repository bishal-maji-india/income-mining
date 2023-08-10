const mongoose = require('mongoose');
const User = require('../models/userModel');
const GlobalCount=require('../models/globalCountModel');
const { ObjectId } = require('mongodb'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For password hashing
const expressAsyncHandler = require('express-async-handler');


//@desc Current User Information
//@route GET /api/users/current
//@access private
const currentUser = expressAsyncHandler(async (req,res)=>{

 res.status(200).json({ success: true, user: req.user });

});


//@desc Login User
//@route POST /api/users/login
//@access public
const login = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  // Check if any required fields are missing
  if (!password || !username ) {
    return res.status(400).json({ success: false, message: 'All Login fields are required' });
  }
  // Insert the new child node and update the parent node
  try {
  

    // Call the insertChildAndUpdateParent function
    const response = await loginUser(username,password);

    // If the above logic is successful, send a success response with the message
    if (response.success) {
      //save the response jwt for further request 
      res.status(200).json({ success: true, message: response.message, token:response.token });
    } else {
      res.status(500).json({ success: false, message: response.message });
    }
  } catch (error) {
    // If any error occurs during registration, send an error response
    return res.status(500).json({ success: false, message: 'An error occurred during Login' });
  }
};

async function loginUser(username, password){
  try {

    // Step 1: Find the user by usernameusername
    const user = await User.findOne({ username:username});

    // Check if the user exists
    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }

    // Step 2: Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password"
      };
    }

       const token=jwt.sign({
        user:{
          username:user.username,
          name: user.name,
          email:user.email,
          parent_id:user.parent_id,
          upline_id:user.upline_id,
          id: user.id,
          mobile:user.mobile,
          left_child_id:user.left_child_id,
          right_child_id:user.right_child_id,
          is_active_user:user.is_active_user,
          left_count:user.left_count,
          right_count:user.right_count,
          u_left_count:user.u_left_count,
          u_right_count:user.u_right_count,
          amount:user.amount
        }
       },process.env.ACCESS_TOKEN_SECRET,
       {expiresIn: "3m"}
       );

    return {
      success: true,
      message: "Login successful",
      token:token
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

//@desc Register User
//@route POST /api/users/register
//@access public
const register = async (req, res) => {
  const {
    password,
    parent_id,
    position,
    name,
    upline_id,
    mobile,
    email,
    address,
    state,
    country,
    pin,
    pan
  } = req.body;

  // Check if any required fields are missing
  if (!password || !parent_id || !position || !name || !upline_id || !mobile || !email || !address || !state || !country || !pin) {
    return res.status(400).json({ success: false, message: 'All register fields are required' });
  }

  // Convert parent_id and upline_id from string to ObjectId using mongoose.Types.ObjectId()
  const parentId = mongoose.Types.ObjectId.createFromHexString(parent_id);
  const uplineId = mongoose.Types.ObjectId.createFromHexString(upline_id);

let numberResult = await getGlobalNumber();

let new_username="IM" + name.slice(0, 2).toUpperCase();
if (numberResult.success) {
   new_username = new_username+ numberResult.message;
} else {
  console.error("Failed to get global number:", numberResult.message);
  return res.status(500).json({ success: false, message: 'Something went wrong' });

}
  // Insert the new child node and update the parent node
  try {
        // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds


    const newChildNode = {
      username: new_username,
      password: hashedPassword,
      parent_id:parentId,
      name,
      upline_id:uplineId,
      mobile,
      email,
      address,
      state,
      country,
      pin,
      pan
    };
    


    // Call the insertChildAndUpdateParent function
    const response = await insertChildAndUpdateParent(upline_id, position, newChildNode);

    // If the above logic is successful, send a success response with the message
    if (response.success) {
      res.status(200).json({ success: true, message: response.message });
    } else {
      res.status(500).json({ success: false, message: response.message });
    }
  } catch (error) {
    // If any error occurs during registration, send an error response
    return res.status(500).json({ success: false, message: 'An error occurred during registration' });
  }
};


// Function to insert the new child node and update the parent node
async function insertChildAndUpdateParent( upline_id,position, newChild) {
  try {
    // Step 1: Insert the new child node
    const childNode = new User(newChild);
    const savedChild = await childNode.save();
    const newChildId = savedChild._id; // Get the username after saving the child

    // Step 2: Update the parent node
    const updateField = position === 'left' ? 'left_child_id' : 'right_child_id';
// Assuming the User variable is already declared or imported
await User.updateOne({ _id: upline_id }, { $set: { [updateField]: newChildId } });
// const newUser = await User.findOne({ username: newChildId });


// Fetch the updated user after the update
const newUser = await User.findById(newChildId);

// Check if the user was found
if (!newUser) {
  return {
    success: false,
    message: "User not Found"
  };
}

// Return the updated user's dataupdateField
return {
  success: true,
  message: "Username: " + newUser.username
};

  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}


//@desc assign upline id from parent id 
//@route POST /api/users/assignUplineId
//@access public
const assignUplineId = async (req, res) => {

  const { sponsor_id, position} = req.body;

  if (!sponsor_id ) {
    return res.status(400).json({ success: false, message: 'Sponsor id is missing' });
  }
  if (!position ) {
    return res.status(400).json({ success: false, message: 'Postion is missing' });
  }


  try {
    const node = await User.findOne({ username: sponsor_id});
    const uplineNode = await findNearestNodeWithNullChild(sponsor_id, position);
    res.status(200).json({ success: true, upline_id: uplineNode, sponsor_id: node._id });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

async function findNearestNodeWithNullChild(sponsor_id, position) {
  const node = await User.findOne({ username: sponsor_id});

  if (!node) {
    console.log("Node not found!");
    return null;
  }

  // Check if the current node has no left or right child
  if (!node.left_child_id && !node.right_child_id) {
    return node._id; // Return the current node ID itself
  }

  let childId = position === "left" ? node.left_child_id : node.right_child_id;

  // If the specified position is "left" and the left child is null, or
  // if the specified position is "right" and the right child is null,
  // return the current node ID itself.
  if ((position === "left" && !childId) || (position === "right" && !childId)) {
    return node._id;
  }

  // Recursively find the nearest node with null child
  return await findNearestNodeWithNullChild(childId, position);
}



const getGlobalNumber = async () => {
  const docid = mongoose.Types.ObjectId.createFromHexString('64ce19a74b2f5e0900c8ff78');

    try {
    const result = await GlobalCount.findByIdAndUpdate(
      { _id: docid},
      { $inc: { im: 1 } },
      { new: true }
    );
    const incrementedValue = result.im;
    return {
      success: true,
      message: incrementedValue
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: error
    };
  }



};

async function getFullChildNodes(nodeId) {
  const node = await User.findById(nodeId);
  if (!node) {
    console.log("Node not found!");
    return [];
  }

  const childNodes = [node]; // Start with the current node as an array

  // Recursively traverse the left child
  if (node.left_child_id) {
    const leftChildNodes = await getFullChildNodes(node.left_child_id);
    childNodes.push(...leftChildNodes); // Concatenate the left child nodes
  }

  // Recursively traverse the right child
  if (node.right_child_id) {
    const rightChildNodes = await getFullChildNodes(node.right_child_id);
    childNodes.push(...rightChildNodes); // Concatenate the right child nodes
  }

  return childNodes;
}


// async function countChildNodes(nodeId) {
  
//   const node = await User.findById(nodeId);
//   if (!node) {
//     console.log("Node not found!");
//     return { left: 0, right: 0 };
//   }

//   let leftChildCount = 0;
//   let rightChildCount = 0;

//   if (node.left_child_id) {
//     // Recursively count the left child nodes
//     const leftChildNode = await User.findById(node.left_child_id);
//     if (leftChildNode && leftChildNode.is_active_user) {
//       const leftChildCounts = await countChildNodes(node.left_child_id);
//       leftChildCount = leftChildCounts.left + leftChildCounts.right + 1;
//     }
//   }

//   if (node.right_child_id) {
//     // Recursively count the right child nodes
//     const rightChildNode = await User.findById(node.right_child_id);
//     if (rightChildNode &uplineId& rightChildNode.is_active_user) {
//       const rightChildCounts = await countChildNodes(node.right_child_id);
//       rightChildCount = rightChildCounts.left + rightChildCounts.right + 1;
//     }
//   }

//   return { left: leftChildCount, right: rightChildCount };
// }

//@desc get list of child nodes of User
//@route POST /api/users/getChildNodes
//@access public
const getChildNodes = async (req, res) => {
  const { node_id } = req.body;

  if (!node_id) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const nodeId = mongoose.Types.ObjectId.createFromHexString(node_id);

  try {
    const childNodes = await getFullChildNodes(nodeId);
    res.status(200).json({ success: true, nodes: childNodes });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports.register = register;
module.exports.getChildNodes = getChildNodes;
module.exports.assignUplineId = assignUplineId;
module.exports.login=login;
module.exports.currentUser=currentUser;
