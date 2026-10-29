const mineflayer = require('mineflayer')
const http = require('http')

// 1. FREE TIER WORKAROUND: Create a fake webpage server
// This stops Render from spinning down your free service.
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Minecraft Keeper Bot is Online!')
})

// Render automatically assigns a port via process.env.PORT
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT} to keep free tier alive.`)
})

// 2. YOUR MINECRAFT BOT LOGIC
function createBot() {
  const bot = mineflayer.createBot({
    host: 'lungfish.aternos.host', // Your Aternos DynIP
    port: 55545,                              // Your Aternos Port
    username: 'AternosKeeper',
    version: '26.3'
  })

  bot.on('spawn', () => {
    console.log('Bot successfully connected to Aternos!')
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
