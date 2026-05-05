import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/admin': {
            target: 'https://dheerajrathodconsult.com',
            changeOrigin: true,
            secure: true,
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
