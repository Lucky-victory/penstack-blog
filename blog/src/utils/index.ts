import { SnowflakeIdGenerator } from "@green-auth/snowflake-unique-id";
export const shortIdGenerator = new SnowflakeIdGenerator({
    nodeId:23,sequenceBits:24
});

export function resolveIPFSURI(
    ipfsURI: string,
    addGateWayUrl = true,
    gatewayUrl = "https://cloudflare-ipfs.com/"
  ): string {
    // Check if the URI starts with 'ipfs://'
    if (ipfsURI.startsWith("ipfs://")) {
      // Remove 'ipfs://' and return the modified URI
      const modifiedURI = ipfsURI.replace("ipfs://", "ipfs/");
      return addGateWayUrl ? gatewayUrl + modifiedURI : modifiedURI;
    } else {
      // If the URI doesn't start with 'ipfs://', return as it is
      return addGateWayUrl ? gatewayUrl + ipfsURI : ipfsURI;
    }
  }
  export function shortenText(text: string, len = 50) {
    return text?.length > len ? text?.substring(0, len) + "..." : text;
  }