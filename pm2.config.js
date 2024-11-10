module.exports = {
  apps: {
    name: "iqos-rfid-api",
    script: "pnpm dev",
    instances: 1,
    exec_mode: "fork",
    watch: false,
    env_production: {
      NODE_ENV: "production",
      PORT: 5173,
      MODE: "build",
    },
    env_development: {
      NODE_ENV: "development",
      PORT: 5173,
      MODE: "build",
    },
  },
};
