import "dotenv/config";

import app from "./src/app.js";

import connectDB from "./src/configs/db.js";

// cron jobs
import startCronJobs from "./src/utils/interestCron.js";



// database connection

connectDB();



// start automatic cron jobs

startCronJobs();



// server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});