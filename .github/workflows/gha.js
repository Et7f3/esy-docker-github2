const cache  = require("@actions/cache");
const core   = require("@actions/core");
const cp     = require("child_process");
const crypto = require("crypto");
const fs     = require("fs");
const glob   = require("@actions/glob");
const hash   = crypto.createHash("sha256");
const os     = require("os");
const path   = require("path");


const ESY_FOLDER = process.env.ESY__PREFIX
  ? process.env.ESY__PREFIX
  : path.join(os.homedir(), ".esy");
const esy3 = fs
  .readdirSync(ESY_FOLDER)
  .filter(name => name.length > 0 && name[0] === "3")
  .sort()
  .pop();
const esy_path = path.join(ESY_FOLDER, esy3, "i")

let hashLockDir = async (patterns, continuation) => {
  const globber = await glob.create(patterns.join('\n'))
  const globFiles = await globber.glob()
  const files = globFiles.filter(name => fs.statSync(name).isFile()).sort()
  files.forEach(name => {
    hash.write(fs.readFileSync(name))
  })
  hash.on("readable", () => {
    const data = hash.read();
    if (data) {
      continuation(data.toString('hex'));
    }
  })
  hash.end()
}

let my_exec = (name, cmd) => {
  core.startGroup(name)
  core.info(cp.execSync(cmd))
  core.endGroup()
}

(async () => {
  const patterns = ["a", "c"]
  if (process.argv.length < 3)
    console.error("usage: node script save|restore|build");
  switch (process.argv[2]) {
    case "save":
      await hashLockDir(patterns, async key => {
        await cache.saveCache([path], key)
      })
      break;
    case "restore":
      await hashLockDir(patterns, async key => {
        const cacheKey = await cache.restoreCache([esy_path], key, [""])
        // any restore-keys
        if (cacheKey === key) {
          console.log("Cache restored")
        } else {
          my_exec("Build deps in release", "esy build-dependencies --release")
          if (!cacheKey)
            my_exec("Pruning cache", "esy cleanup .")
        }
      })
      break;
    case "build":
      my_exec("Build project in release", "esy build --release")
      break;
    default:
      console.error(process.argv[2], "<> save/restore/build");
      process.exit(2);
  }
})()
