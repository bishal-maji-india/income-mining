document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('binaryTreeCanvas');
  const ctx = canvas.getContext('2d');
  const canvasScroll = document.getElementById('canvasScroll'); // Get the canvas scroll container

  class TreeNode {
    constructor(id, name, left_child_id, right_child_id, x, y) {
      this.id = id;
      this.name = name;
      this.left_child_id = left_child_id;
      this.right_child_id = right_child_id;
      this.x = x;
      this.y = y;
    }
  }

  function getFirstLetter(name) {
    return name.charAt(0);
  }

  function drawNode(x, y, r, text, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }

  function drawLine(fromx, fromy, tox, toy, ctx) {
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.closePath();
    ctx.stroke();
  }

  function drawTree(treeNodes, currentNode, xstep, ystep, distance) {
    if (currentNode !== null) {
      const node = treeNodes.find((n) => n.id === currentNode.id);
      drawNode(xstep, ystep, 20, getFirstLetter(node.name), ctx);
      node.x = xstep;
      node.y = ystep;
    }

    // Check if it's a leaf node (no left and right children)
    if (currentNode !== null && currentNode.left_child_id === null && currentNode.right_child_id === null) {
      return; // Terminate drawing for this branch
    }

    // Draw left tree
    if (currentNode !== null && currentNode.left_child_id !== null) {
      const leftNode = treeNodes.find((n) => n.id === currentNode.left_child_id);
      drawLine(xstep, ystep + 20, xstep - distance, ystep + 100 - 20, ctx);
      drawTree(treeNodes, leftNode, xstep - distance, ystep + 100, distance / 2 + 20);
    }

    // Draw right tree
    if (currentNode !== null && currentNode.right_child_id !== null) {
      const rightNode = treeNodes.find((n) => n.id === currentNode.right_child_id);
      drawLine(xstep, ystep + 20, xstep + distance, ystep + 100 - 20, ctx);
      drawTree(treeNodes, rightNode, xstep + distance, ystep + 100, distance / 2 + 20);
    }
  }

  function drawCenteredTree(treeNodes) {
    const treeWidth = treeNodes.length * 100;
    const xStart = treeWidth / 2; // Center the tree horizontally
    const yStart = 100;

    drawTree(treeNodes, treeNodes[0], xStart, yStart, 100);
  }

  function resizeCanvasToFitTree(treeNodes) {
    const maxX = Math.max(...treeNodes.map((node) => node.x));
    const maxY = Math.max(...treeNodes.map((node) => node.y));
    const treeWidth = maxX + 100;
    const treeHeight = maxY + 200; // Add some extra space for the bottom of the tree

    canvas.width = treeWidth;
    canvas.height = treeHeight;

    drawCenteredTree(treeNodes);
  }

  // Declare the treeNodes variable outside the fetchDataAndDrawTree function
  let treeNodes = [];

  async function fetchDataAndDrawTree() {
    console.log("started");
    const baseUrl = "https://income-mining.onrender.com/api/users/getChildNodes";
    const nodeId = "64c00b6a849a379cc91b4ab4"; // Replace this with the node ID from your input field

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Add the Accept header
        },
        body: JSON.stringify({ node_id: nodeId }),
      });
      // if (!response.ok) {
      //   throw new Error("Network response was not ok.");
      // }  
      const nodeData = await response.json();

      if (nodeData.success === true) {
        const apiResponse = nodeData.nodes;
        console.log(apiResponse);
        treeNodes = apiResponse.map((nodeData) => new TreeNode(nodeData._id, getFirstLetter(nodeData.name), nodeData.left_child_id, nodeData.right_child_id));

        // Draw the centered tree using the fetched data
        resizeCanvasToFitTree(treeNodes);
      } else {
        console.error("API call failed.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Call the fetchDataAndDrawTree function to make the API call and fetch the data
  fetchDataAndDrawTree();
  // Handle click events on the canvas
  canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let nodeClicked = false;

    // Check if any node is clicked
    for (const node of treeNodes) {
      const xDistance = Math.abs(x - node.x);
      const yDistance = Math.abs(y - node.y);

      if (xDistance <= 20 && yDistance <= 20) {
        nodeClicked = true;
        // Show the popup above the clicked node
        const popup = document.getElementById('popup');
        popup.style.display = 'block';

        // Calculate the position to center the popup above the node
        updatePopupPosition(popup, node);

        // Set the popup content with node details
        const popupName = document.getElementById('popupName');
        const popupId = document.getElementById('popupId');
        popupName.textContent = `Name: ${node.name}`;
        popupId.textContent = `ID: ${node.id}`;
        break; // Only handle the first clicked node (if multiple nodes overlap)
      }
    }

    // If no node is clicked, hide the popup
    if (!nodeClicked) {
      const popup = document.getElementById('popup');
      popup.style.display = 'none';
    }
  });

  // Handle scroll events on the canvasScroll div
  canvasScroll.addEventListener('scroll', function () {
    // Check if the popup is currently visible
    const popup = document.getElementById('popup');
    if (popup.style.display === 'block') {
      // Find the clicked node and update the popup position
      for (const node of treeNodes) {
        const xDistance = Math.abs(event.clientX - rect.left - node.x);
        const yDistance = Math.abs(event.clientY - rect.top - node.y);

        if (xDistance <= 20 && yDistance <= 20) {
          updatePopupPosition(popup, node);
          break; // Only update the position for the first clicked node (if multiple nodes overlap)
        }
      }
    }
  });
  
    // Function to update popup position when scrolling
    function updatePopupPosition(popup, node) {
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;
      const popupX = node.x - popupWidth / 2;
      const popupY = node.y - popupHeight - 20 - canvasScroll.scrollTop;
      popup.style.left = `${popupX}px`;
      popup.style.top = `${popupY}px`;
    }
  
    // Handle scroll events on the canvasScroll div
    canvasScroll.addEventListener('scroll', function () {
      // Check if the popup is currently visible
      const popup = document.getElementById('popup');
      if (popup.style.display === 'block') {
        // Find the clicked node and update the popup position
        for (const node of treeNodes) {
          const xDistance = Math.abs(event.clientX - rect.left - node.x);
          const yDistance = Math.abs(event.clientY - rect.top - node.y);
  
          if (xDistance <= 20 && yDistance <= 20) {
            updatePopupPosition(popup, node);
            break; // Only update the position for the first clicked node (if multiple nodes overlap)
          }
        }
      }
    });
  });