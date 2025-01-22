module.exports = {
  apps: [
    {
      name: 'dashboard',
      port: process.env.PORT,
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
      log: 'logs.log',
    }
  ]
}
