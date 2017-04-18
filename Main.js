const Redis = require("ioredis")
const Promise = require("bluebird")
const FP = require("lodash/fp")



const Main = async () => {
  const host = process.env.host || "127.0.0.1"
  const port = parseInt(process.env.port, 10) || 7000
  const redisNodes = [
    { host, port }
  ]
  const clientSettings = {
    enableReadyCheck: true,
    scaleReads: "slave",
  }
  const rcc = new Redis.Cluster(
    redisNodes,
    clientSettings
  )

  rcc.once("error", (error) => {
    console.log("Failed to boot because the redis client encountered an error")
    console.error(error)
    process.exit(1)
  })

  const clusterInfo = await rcc.cluster("info")
  console.log("clusterInfo", clusterInfo)

  for (let i of FP.range(0,100000)) {
    const fooIResult = await rcc.set(`foo-{i}`, i)
    console.log("set: ", fooIResult)

    const fooI = await rcc.get(`foo-{i}`)
    console.log("get: ", fooI)
  }

  const quitResult = await rcc.quit()
  console.log("quitResult: ", quitResult)
}

Main()
