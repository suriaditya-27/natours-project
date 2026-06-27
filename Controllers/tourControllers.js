// const fs = require('fs');
const Tour = require('D:/complete-node-bootcamp-master/4-natours/starter/Models/tourModel.js');
const ApiFeatures = require('./../utils/Apifeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError.js');

exports.aliasTopTours = (req, res, next) => {
  req.query = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

//now i want you to remove try from all and catch from all the functions and instead of that wrap the whole function in a catchAsync function which will catch the error and pass it to the global error handling middleware
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {
    //     _id: {$ne:'EASY'},
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'Success',
    results: stats.length,
    // requestedAt: req.requestTime,
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'Success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};

exports.allTour = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;
  console.log(req.query);

  //SEND RESPONSE
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    // requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // try
  // const newTour = new Tour({name,rating...})
  //newTour.save()

  const newTour = await Tour.create(req.body); //Tour.create returns a promise
  res.status(201).json({
    status: 'Success',
    data: {
      tours: newTour,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'Fail',
  //     message: 'Invalid data sent',
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      // tour: '<upaded tour here...>',
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//written at top

//contains the main js data -- NO LONGER NEEDED
// const tours = JSON.parse(
//   fs.readFileSync(
//     'D:/complete-node-bootcamp-master/4-natours/starter/dev-data/data/tours-simple.json',
//   ),
// );

//NOw this is also not needed MONGODB's ID will itself check it
// exports.checkId = (req, res, next, val) => {
//   console.log(`The id is : ${val}`);
//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Tour access',
//     });
//   }
//   next();
// };

//was written in getAllTours but now we are using it in a separate file and importing it here
// const id = req.params.id * 1; //converting string to number
// const tour = tours.find((el) => el.id === id);

// // if (id >= tours.length)
// if (!tour) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'Invalid Tour access',
//   });
// }

// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// });

//was written in createTour but now we are using it in a separate file and importing it here
// console.log(req.body);
// const newId = tours.length;
// const newTour = Object.assign({ id: newId }, req.body);
// tours.push(newTour);
// fs.writeFile(
//   'D:/complete-node-bootcamp-master/4-natours/starter/dev-data/data/tours-simple.json',
//   JSON.stringify(tours),
//   (err) => {
//     if (err) {
//       return res.status(500).json({
//         status: 'fail',
//         message: 'Failed to write file',
//       });
//     }
//     res.status(201).json({
//       status: 'Success',
//       data: {
//         tours: newTour,
//       },
//     });
//   },
// );

//BUILD QUERY
// //1. Filtering
// const queryObj = { ...req.query };
// const excludedFields = ['sort', 'limit', 'page', 'fields'];

// excludedFields.forEach((el) => delete queryObj[el]);
// // const query = Tour.find(queryObj);

// //2.) Advanced Filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// let query = Tour.find(JSON.parse(queryStr));
// // const tours = await Tour.find(req.query);

//3.) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

//4.) Field Limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }
//filtering method 1
// const tours = await Tour.find({
//   duration: 5,
//   difficulty: 'easy',
// });

//filtering method 2
// const tours = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

//5.) Pagination
// const page = req.query.page * 1 || 1; // *->to convert to string and by defult page 1
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (numTours <= skip) {
//     throw new Error('This page does not exist');
//   }
// }
