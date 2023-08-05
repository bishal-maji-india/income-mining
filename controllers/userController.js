const mongoose = require('mongoose');
const User = require('../models/userModel');
const connectDB = require('../config/connectionDb');
//@desc Register User
//@route POST /api/users/register
//@access public
const register = async (req, res) => {
  const {
    username,
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
  if (!password || !username || !parent_id || !position || !name || !upline_id || !mobile || !email || !address || !state || !country || !pin) {
    return res.status(400).json({ success: false, message: 'All register fields are required' });
  }

  // Convert parent_id and upline_id from string to ObjectId using mongoose.Types.ObjectId()
  const parentId = mongoose.Types.ObjectId.createFromHexString(parent_id);
  const uplineId = mongoose.Types.ObjectId.createFromHexString(upline_id);
  const number=await getGlobalNumber();
  username="IM"+name.slice(0, 2).toUpperCase()+number;
  // Insert the new child node and update the parent node
  try {
    const newChildNode = {
      username,
      password,
      parent_id: parentId,
      name,
      upline_id: uplineId,
      mobile,
      email,
      address,
      state,
      country,
      pin,
      pan
    };
    


    // Call the insertChildAndUpdateParent function
    const response = await insertChildAndUpdateParent(uplineId, position, newChildNode);

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
async function insertChildAndUpdateParent(uplineId, position, newChild) {
  try {
    // Step 1: Insert the new child node
    const childNode = new User(newChild);
    const savedChild = await childNode.save();
    const newChildId = savedChild._id; // Get the generated _id after saving the child

    // Step 2: Update the parent node
    const updateField = position === 'left' ? 'left_child_id' : 'right_child_id';
// Assuming the User variable is already declared or imported
await User.updateOne({ _id: uplineId }, { $set: { [updateField]: newChildId } });

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
  message: "Username: " + newUser.username + "    " + "Password: " + newUser.password
};

  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

//@desc get l
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

  const nodeId = mongoose.Types.ObjectId.createFromHexString(sponsor_id);

  try {

    //here first we will get the global number
    const number= await getGlobalNumber();
   
    const uplineNode = await findNearestNodeWithNullChild(nodeId, position);
    res.status(200).json({ success: true, upline_id: uplineNode });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
async function findNearestNodeWithNullChild(uplineId, position) {
  console.log("uid"+uplineId);
  const node = await User.findById(uplineId);
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



const getGlobalNumber = async (req, res) => {

  try {

    const db = mongoose.connection.db; // Get the database instance from Mongoose
    const collection = db.collection('global_user_count');

    // Find the document and get the current value of the 'im' field
    const result = await collection.findOneAndUpdate(
      { _id: ObjectId('64cdcb18e51bfac6b6e9dd76') },
      { $inc: { im: 1 } }, // Increment the 'im' field by 1
      { returnOriginal: false } // Return the updated document
    );

    const incrementedValue = result.value.im;
    return {
      success: true,
      message: incrementedValue
    };
  } catch (err) {
    console.error('Error:', err.message);
    return {
      success: false,
      message: err.message
    };
  } finally {
    mongoose.disconnect(); // Disconnect from the database when done
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

// const getChildNodes = async (req, res) => {
//   const { node_id } = req.body;getChildNodes

//   if (!node_id) {module.exports=getChildNodes;

//     return res.status(400).json({ success: false, message: 'All fields are required' });
//   }

//   const nodeId = mongoose.Types.ObjectId.createFromHexString(node_id);

//   const childCounts = await countChildNodes(nodeId);

//   res.status(200).json({ success: true, message: "left childs="+childCounts.left+"right childs="+childCounts.right });
// };



// async function insertFirstUserTEST(parent_id){
//   //  for inserting the first user
//   const parentId = mongoose.Types.ObjectId.createFromHexString(parent_id);
//   await User.create({
//     username:"First User Test",
//     upline_id:parentId,
//     sponsor_id:parentId,
//     value:1
//     });
// }