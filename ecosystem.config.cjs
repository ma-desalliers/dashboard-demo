module.exports = {
  apps: [
    {
      name: 'dashboard',
      port: '3001',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
      log: 'logs.log',
    }
  ]
}
