const mineflayer = require('mineflayer')
const PrismarineProxy = require('prismarine-proxy').InstantConnectProxy
const http = require('http')

const TARGET_HOST = 'devario.aternos.host' // Put your Aternos DynIP here
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

// 3. Connect the Mineflayer Bot Function
function startBotInstance() {
  const bot = mineflayer.createBot({
    host: '127.0.0.1',
    port: LOCAL_PROXY_PORT,
    username: 'AternosKeeper',
    version: '1.21' // The stable engine your bot uses locally
  })

  bot.on('spawn', () => {
    console.log('Bot successfully connected to Aternos via proxy!')
    startAntiAFK(bot)
  })

  bot.on('end', () => {
    console.log('Disconnected. Attempting reconnect sequence...')
    setTimeout(startBotInstance, 30000)
  })

  bot.on('error', (err) => console.log('Bot Network Notice:', err.message))
}

// 4. Anti-AFK Routine to prevent kicks
function startAntiAFK(bot) {
  let moveToggle = true
  setInterval(() => {
    if (!bot.entity) return
    bot.setControlState('forward', moveToggle)
    bot.setControlState('back', !moveToggle)
    
    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * Math.PI * 0.5
    bot.look(yaw, pitch)

    moveToggle = !moveToggle
  }, 5000)
}

// 5. Fire off the engine execution
startBotInstance()
