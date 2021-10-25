module.exports = {
  apps : [{
    name: 'admin',
    script: 'app.js',
    version: "1.0.0",
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file:'/efs/dtx_logs/admin/admin.log',
    out_file: '/efs/dtx_logs/admin/admin.log',
    log_file: '/efs/dtx_logs/admin/admin.log',
    merge_logs: true
  }],

  deploy : {
    development : {
      user : 'ubuntu',
      host : [{host: 'ec2-13-125-221-170.ap-northeast-2.compute.amazonaws.com', port: "22"}],
      ref  : 'origin/master',
      repo : 'git@github.com:cowithone/DTX_admin_server.git',
      path : '/usr/share/pipe/admin',
      'post-deploy' : 'sudo npm install'
    }
  }
};
