/** @type {import('next').NextConfig} */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eaidmzuwhzdcepedenlo.supabase.co"
const supabaseHostname = new URL(supabaseUrl).hostname

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/**",
        port: "",
      },
    ],
  },
}

module.exports = nextConfig
