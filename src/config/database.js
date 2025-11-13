const mongoose = require('mongoose');
let  dbUrl=process.env.atlasUrl


async function main() {
  await mongoose.connect(dbUrl);
}
module.exports =main;