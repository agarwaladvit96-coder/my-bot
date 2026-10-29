const mineflayer = require('mineflayer')
const viaproxy = require('mineflayer-viaproxy') // Installs the translation module
const http = require('http')

// Web server utility to keep Render free tier alive
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Minecraft Keeper Bot is Online!')
})
const PORT = process.env.PORT || 3000
server.listen(PORT)

function createBot() {
  const bot = mineflayer.createBot({
    host: 'ox.aternos.org', // Use your current Aternos DynIP
    port: 55545,                              // Use your current Aternos Port
    username: 'AternosKeeper',
    version: '26.1'                           // Run bot stable protocol locally
  })

  // Load the translator extension to bridge from 26.1 over to the 26.3 server
  bot.loadPlugin(viaproxy) 

  bot.on('spawn', () => {
    console.log('Bot successfully connected to Aternos 26.3!')
    startAntiAFK(bot)
  })

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 30 seconds...')
    setTimeout(createBot, 30000)
  })

  bot.on('error', (err) => console.log('Error:', err))
}

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

createBot()
