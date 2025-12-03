module.exports = {
  apps: [{
    name: 'rideshare-backend',
    script: './dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    combine_logs: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=4096'
  }]
};