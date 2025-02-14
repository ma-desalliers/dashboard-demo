
module.exports = {
  apps: [
    {
      name: 'dashboard-demo',
      node_args: "-r dotenv/config",
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
      log: 'logs.log',
    }
  ]
}
