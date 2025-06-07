import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/zengelw95_home/', // if deploying to https://username.github.io/your-repo-name/
  plugins: [react()],
})
