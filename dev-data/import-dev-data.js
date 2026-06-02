const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('D:/complete-node-bootcamp-master/4-natours/starter/Models/tourModel.js');

// ✅ Fix 1: Correct path to config.env
dotenv.config({ path: '../config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// ✅ Fix 2: Remove deprecated options
mongoose.connect(db).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(
    'D:/complete-node-bootcamp-master/4-natours/starter/dev-data/data/tours-simple.json',
    'utf-8',
  ),
);

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!!');
    process.exit(); // ✅ Fix 3: Exit after done
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!!');
    process.exit(); // ✅ Fix 3: Exit after done
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please use --import or --delete flag');
  process.exit();
}
console.log(process.argv);
