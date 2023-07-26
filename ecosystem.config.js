module.exports = {
    apps : [
        {
        name: "lotto-server",
        script: "npm run start:dev",
        pre_exec: "npm run start:db",
        instances: "1",
        autorestart: false,
        watch: false,
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        }
        
      },
    ]
  };
  