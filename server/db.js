import mongoose from "mongoose";

const DIRECT_URI =
  "mongodb://{USER}:{PASS}@ac-rbhxuer-shard-00-00.segrgoi.mongodb.net:27017,ac-rbhxuer-shard-00-01.segrgoi.mongodb.net:27017,ac-rbhxuer-shard-00-02.segrgoi.mongodb.net:27017/{DB}?ssl=true&authSource=admin&retryWrites=true&serverSelectionTimeoutMS=20000";

function buildDirectUri(uri) {
  const url = new URL(uri.replace("mongodb+srv://", "mongodb://"));
  const user = decodeURIComponent(url.username);
  const pass = decodeURIComponent(url.password);
  const db = url.pathname.replace(/^\//, "") || "ablespace";
  return DIRECT_URI.replace("{USER}", encodeURIComponent(user))
    .replace("{PASS}", encodeURIComponent(pass))
    .replace("{DB}", db);
}

function isDnsError(err) {
  const code = String(err?.cause?.code || err?.code || "");
  return ["querySrv", "ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "EAI_AGAIN"].some(
    (c) => code === c || code.startsWith(c)
  );
}

export async function connectDb(uri) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    return { via: "srv", uri };
  } catch (err) {
    if (!isDnsError(err)) throw err;
    const direct = buildDirectUri(uri);
    console.warn(`[db] SRV lookup failed (${err.message}), using direct connection`);
    await mongoose.connect(direct, { serverSelectionTimeoutMS: 20000 });
    return { via: "direct", uri: direct };
  }
}
