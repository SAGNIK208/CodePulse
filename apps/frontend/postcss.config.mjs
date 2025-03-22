import tailwind_config from "@repo/tailwind-config/postcss.config.mjs"

const config = {
    plugins: {
      "@tailwindcss/postcss": {config:tailwind_config},
    },
  };
  export default config;