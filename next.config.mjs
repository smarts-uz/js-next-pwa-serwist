// import withSerwistInit from "@serwist/next";

// const withSerwist = withSerwistInit({
//   // Service worker configuration
//   swSrc: "app/sw.ts",
//   swDest: "public/sw.js",
//   disable: process.env.NODE_ENV === "development",
//   scope: '/',
//   include: [
//     '/',
//     '/offline',
//     '/manifest.json',
//     '/favicon.ico',
//     '/features/**',
//     '/**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot}',
//     '/**/*.{json,md}',
//   ],
//   additionalPrecacheEntries: [
//     {
//       url: '/offline',
//       revision: '1',
//     },
//   ],
// });

// let userConfig = undefined;
// try {
//   userConfig = await import("./v0-user-next.config");
// } catch (e) {
//   // ignore error
// }

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// };

// mergeConfig(nextConfig, userConfig);

// function mergeConfig(nextConfig, userConfig) {
//   if (!userConfig) {
//     return;
//   }

//   for (const key in userConfig) {
//     if (
//       typeof nextConfig[key] === "object" &&
//       !Array.isArray(nextConfig[key])
//     ) {
//       nextConfig[key] = {
//         ...nextConfig[key],
//         ...userConfig[key],
//       };
//     } else {
//       nextConfig[key] = userConfig[key];
//     }
//   }
// }

// export default withSerwist(nextConfig);
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: '/app/sw.ts',
  swDest: 'public/sw.js',
});

export default withSerwist({});