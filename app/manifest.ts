import defineManifest from '@serwist/next';

export default defineManifest({
  injectionPoint: '__SW_MANIFEST',
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  include: [
    '/',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    '/features/**',
    '/**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot}',
    '/**/*.{json,md}',
  ],
}); 