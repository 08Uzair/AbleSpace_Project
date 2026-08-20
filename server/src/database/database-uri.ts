import * as dns from "node:dns/promises";

const DIRECT_URI =
  "mongodb://{USER}:{PASS}@ac-rbhxuer-shard-00-00.segrgoi.mongodb.net:27017,ac-rbhxuer-shard-00-01.segrgoi.mongodb.net:27017,ac-rbhxuer-shard-00-02.segrgoi.mongodb.net:27017/{DB}?ssl=true&authSource=admin&retryWrites=true&serverSelectionTimeoutMS=20000";

function buildDirectUri(uri: string): string {
  const url = new URL(uri.replace("mongodb+srv://", "mongodb://"));
  const user = decodeURIComponent(url.username);
  const pass = decodeURIComponent(url.password);
  const db = url.pathname.replace(/^\//, "") || "ablespace";
  return DIRECT_URI.replace("{USER}", encodeURIComponent(user))
    .replace("{PASS}", encodeURIComponent(pass))
    .replace("{DB}", db);
}

export async function resolveMongoUri(uri?: string): Promise<{
  via: "srv" | "direct";
  uri: string;
}> {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!uri.startsWith("mongodb+srv://")) {
    return { via: "srv", uri };
  }
  try {
    const url = new URL(uri.replace("mongodb+srv://", "mongodb://"));
    const addresses = await dns.resolveSrv(`_mongodb._tcp.${url.hostname}`);
    if (!addresses.length) throw new Error("SRV record has no addresses");
    return { via: "srv", uri };
  } catch (err) {
    console.warn(
      `[db] SRV lookup failed (${(err as Error).message}), using direct connection`
    );
    return { via: "direct", uri: buildDirectUri(uri) };
  }
}
