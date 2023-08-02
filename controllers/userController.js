const mongoose = require('mongoose');
const User = require('../models/userModel');

//@desc Register User
//@route POST /api/users/register
//@access public
const register = async (req, res) => {
  const { username,password,parent_id,position,name,upline_id,mobile,email,address,state,country,pin,pan} = req.body;

  if ( !password||!username||!parent_id || !position || !name || !upline_id || !mobile || !email || !address|| !state|| !country|| !pin) {
    return res.status(400).json({ success: false, message: 'All register fields are required' });
  }

  // Convert parent_id from string to ObjectId using mongoose.Types.ObjectId()
  const parentId = mongoose.Types.ObjectId.createFromHexString(parent_id);
  const uplineId = mongoose.Types.ObjectId.createFromHexString(upline_id);
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
  //  insertFirstUserTEST(parentId);

  insertChildAndUpdateParent(uplineId, position, newChildNode);



  res.status(200).json({ success: true, message: 'Registration successful' });
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
    await User.updateOne({ _id: uplineId }, { $set: { [updateField]: newChildId } });

    console.log('New child node inserted and parent node updated successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}
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
    const uplineNode = await getUplineNodeId(nodeId, position);
    res.status(200).json({ success: true, upline_id: uplineNode });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


async function getUplineNodeId(uplineId, position) {
  const node = await User.findById(uplineId);
  if (!node) {
    console.log("Node not found!");
    return null;
  }

  if (position === "left" && node.left_child_id) {
    // Recursively find the last left child node
    const lastLeftChildId = await getUplineNodeId(node.left_child_id, position);
    if (lastLeftChildId) {
      return lastLeftChildId;
    }
  }

  if (position === "right" && node.right_child_id) {
    // Recursively find the last right child node
    const lastRightChildId = await getUplineNodeId(node.right_child_id, position);
    if (lastRightChildId) {
      return lastRightChildId;
    }
  }

  // If the position is "left" and the node doesn't have a left child, or
  // if the position is "right" and the node doesn't have a right child,
  // return the current node's MongoDB ID
  return node._id;
}


module.exports = {
  assignUplineId,
  register,
  getChildNodes,
 
};

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