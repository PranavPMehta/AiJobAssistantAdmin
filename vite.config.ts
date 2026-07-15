import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { ProxyOptions } from 'vite';

const createAdminApiProxy = (target: string): ProxyOptions => ({
  target,
  changeOrigin: true,
  secure: target.startsWith('https://'),
  configure: (proxy) => {
    proxy.on('proxyRes', (_proxyRes, _req, res: any) => {
      const cookies = _proxyRes.headers['set-cookie'];
      if (cookies) {
        _proxyRes.headers['set-cookie'] = cookies.map((cookie: string) =>
          cookie
            .replace(/;\s*Domain=[^;]*/gi, '')
            .replace(/;\s*Secure/gi, '')
            .replace(/;\s*SameSite=[^;]*/gi, '; SameSite=Lax')
        );
      }
    });
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiTarget = env.VITE_API_TARGET || 'https://dheerajrathodconsult.com';
    const enquiryApiTarget = env.VITE_ADMIN_ENQUIRY_API_TARGET || apiTarget;
    return {
      base: '/admin/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Proxy only backend admin APIs, not the frontend app served at /admin/
          '/admin/login': createAdminApiProxy(apiTarget),
          '/admin/users': createAdminApiProxy(apiTarget),
          '/admin/user': createAdminApiProxy(apiTarget),
          '/admin/jobs': createAdminApiProxy(apiTarget),
          '/admin/enquiries': createAdminApiProxy(apiTarget),
          '/backend-admin-api': {
            ...createAdminApiProxy(enquiryApiTarget),
            rewrite: (path) => path.replace(/^\/backend-admin-api/, ''),
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
