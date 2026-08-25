import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.prod-runtime.all-hands.dev'],
  },
  preview: {
    host: true,
    allowedHosts: ['.prod-runtime.all-hands.dev'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
} as never)
