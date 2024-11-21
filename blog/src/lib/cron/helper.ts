interface CronJobSchedule {
  timezone?: string;
  hours?: number[];
  mdays?: number[];
  minutes?: number[];
  months?: number[];
  wdays?: number[];
}

/**
 * Converts a datetime or array of datetimes into cron-job.org schedule format
 * @param dates - Single Date object or array of Date objects
 * @param timezone - Optional timezone (defaults to UTC)
 * @param recurring - If true, extracts pattern for recurring schedule. If false, creates one-time schedule
 * @returns CronJob schedule object
 */
export function dateTimeToCronJobSchedule(
  dates: Date | Date[],
  timezone: string = "UTC",
  recurring: boolean = false
): CronJobSchedule {
  // Convert single date to array
  const dateArray = Array.isArray(dates) ? dates : [dates];

  if (dateArray.length === 0) {
    throw new Error("At least one date must be provided");
  }

  const schedule: CronJobSchedule = { timezone };

  if (recurring) {
    // For recurring schedules, extract unique values for each time component
    schedule.minutes = [
      ...new Set(dateArray.map((date) => date.getUTCMinutes())),
    ];
    schedule.hours = [...new Set(dateArray.map((date) => date.getUTCHours()))];
    schedule.mdays = [...new Set(dateArray.map((date) => date.getUTCDate()))];
    schedule.months = [
      ...new Set(dateArray.map((date) => date.getUTCMonth() + 1)),
    ];
    schedule.wdays = [...new Set(dateArray.map((date) => date.getUTCDay()))];

    // Remove components that include all possible values (full ranges)
    // E.G. If minutes includes all 60 possible values (0-59)
    // This means "run every minute" so we don't need to specify minutes at all
    // the same goes for others
    if (schedule.minutes?.length === 60) delete schedule.minutes;
    if (schedule.hours?.length === 24) delete schedule.hours;
    if (schedule.mdays?.length === 31) delete schedule.mdays;
    if (schedule.months?.length === 12) delete schedule.months;
    if (schedule.wdays?.length === 7) delete schedule.wdays;
  } else {
    // For one-time schedules, just use the exact times
    schedule.minutes = [
      ...new Set(dateArray.map((date) => date.getUTCMinutes())),
    ];
    schedule.hours = [...new Set(dateArray.map((date) => date.getUTCHours()))];
    schedule.mdays = [...new Set(dateArray.map((date) => date.getUTCDate()))];
    schedule.months = [
      ...new Set(dateArray.map((date) => date.getUTCMonth() + 1)),
    ];
  }

  return schedule;
}

/**
 * Helper function to create a schedule for a specific interval
 * @param interval - Interval in minutes
 * @returns Array of minute values for the schedule
 */
export function createIntervalSchedule(interval: number): number[] {
  if (interval < 1 || interval > 60) {
    throw new Error("Interval must be between 1 and 60 minutes");
  }

  const minutes: number[] = [];
  for (let i = 0; i < 60; i += interval) {
    minutes.push(i);
  }
  return minutes;
}
export function extractFullTimeString(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}
export function mergeDateAndTime(baseDate: Date, timeToMerge: Date): Date {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    timeToMerge.getHours(),
    timeToMerge.getMinutes(),
    timeToMerge.getSeconds()
  );
}
