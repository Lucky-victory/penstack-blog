import { SnowflakeIdGenerator } from "@green-auth/snowflake-unique-id";
export const shortIdGenerator = new SnowflakeIdGenerator({
    nodeId:23,sequenceBits:24
});

