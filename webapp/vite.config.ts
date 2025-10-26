import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose dev server for containers/VMs instead of binding to 127.0.0.1 only
    port: 5173,
    watch: {
      usePolling: true, // required inside some containerized/devcontainer setups for HMR to pick up changes
      interval: 100,
    },
  },
})
