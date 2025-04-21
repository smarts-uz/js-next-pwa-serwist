import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  scope: "/",
  include: [
    "/",
    "/offline",
    "/manifest.json",
    "/favicon.ico",
    "/features/**",
    "/**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot}",
    "/**/*.{json,md}",
  ],
  additionalPrecacheEntries: [
    {
      url: "/offline",
      revision: "1",
    },
  ],
});

export default withSerwist({
  eslint: {
    dirs: ["."],
    ignoreDuringBuilds: false,
  },
});
