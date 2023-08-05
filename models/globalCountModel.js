const mongoose = require('mongoose');

 globalCountSchema = new mongoose.Schema(
    {
        im: { type: Number, default: 100000 }
    }
);

module.exports = mongoose.model('GlobalCount', globalCountSchema);
