// lib/cron.js
import cron from "node-cron";

let scheduledJobs: cron.ScheduledTask[] = [];

export function initCronJobs() {
  // Prevent multiple cron job registrations in development
  if (scheduledJobs.length > 0) {
    scheduledJobs.forEach((job) => job.stop());
    scheduledJobs = [];
  }

  // Example job 1: Runs every minute
  const minutelyJob = cron.schedule("* * * * *", async () => {
    console.log("Running cron job every minute:", new Date().toISOString());
    // Add your task logic here
  });

  // Example job 2: Runs every day at midnight
  const dailyJob = cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cleanup:", new Date().toISOString());
  });

  // Example job 3: Runs every Sunday at 1 AM
  const weeklyJob = cron.schedule("0 1 * * 0", async () => {
    console.log("Running weekly task:", new Date().toISOString());
    // Add your weekly task logic here
  });

  scheduledJobs.push(minutelyJob, dailyJob, weeklyJob);
}
