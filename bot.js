const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'hilsha.aternos.host', // Replace with your current DynIP
    port: 55545,                              // Replace with your current DynIP port
    username: 'AternosKeeper',                // The name of your bot
    version: '26.3'                           // Adjust to match your server version
  })

  bot.on('spawn', () => {
    console.log('Bot successfully connected to Aternos!')
    
    // Start anti-AFK movement pattern after spawning
    startAntiAFK(bot)
  })

  // Automatic Reconnect System if Aternos reboots
  bot.on('end', () => {
    console.log('Disconnected from server. Reconnecting in 30 seconds...')
    setTimeout(createBot, 30000)
  })

  bot.on('error', (err) => console.log('Error encountered: ', err))
}

function startAntiAFK(bot) {
  let moveToggle = true
  
  setInterval(() => {
    if (!bot.entity) return

    // Alternate walking forward and backward every 5 seconds
    bot.setControlState('forward', moveToggle)
    bot.setControlState('back', !moveToggle)
    
    // Make the bot look around slightly to simulate real activity
    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * Math.PI * 0.5
    bot.look(yaw, pitch)

    moveToggle = !moveToggle
  }, 5000)
}

createBot()
