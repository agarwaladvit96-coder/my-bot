const mineflayer = require('mineflayer')
const PrismarineProxy = require('prismarine-proxy').InstantConnectProxy // Uses the specific constructor directly
const http = require('http')

const TARGET_HOST = 'bream.aternos.host' // Put your Aternos DynIP here
const TARGET_PORT = 55545                              // Put your Aternos Port here
const LOCAL_PROXY_PORT = 25565

// 1. Web server utility to keep Render free tier alive
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Minecraft Keeper Bot Proxy Online!')
})
server.listen(process.env.PORT || 3000)

// 2. Start the Protocol Translator using the explicit InstantConnect class
const proxy = new PrismarineProxy({
  clientOptions: {
    host: TARGET_HOST,
    port: TARGET_PORT,
    version: '1.21.3' // Translates output data to match the newer server protocol
  },
  serverOptions: {
    version: '1.21' // The stable client version used internally by mineflayer
  }
})

console.log('Protocol translator running. Deploying bot player...')
startBotInstance()
