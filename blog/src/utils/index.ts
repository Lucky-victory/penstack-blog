import { formatDistanceToNowStrict, format } from 'date-fns';
import { SnowflakeIdGenerator } from "@green-auth/snowflake-unique-id";
export const shortIdGenerator = new SnowflakeIdGenerator({
    nodeId:10,sequenceBits:20
});


export function formatDate(date: Date): string {

  if (!date) return 'Invalid date';
try {
  

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'second' });
  } else if (diff < 3600000) {
    return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'minute' });
  } else if (diff < 86400000) {
    return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'hour' });
  } else {
    return format(date, 'MMM d yyyy');
  }
  } catch (error) {
  return 'Invalid date'
}
}

  export function shortenText(text: string, len = 50) {
    return text?.length > len ? text?.substring(0, len) + "..." : text;
  }