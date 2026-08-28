/** @type {import('next').NextConfig} */
const isSupabaseUrl = value => {
  if (!value) return false
  try {
    return new URL(value).hostname.endsWith(".supabase.co")
  } catch {
    return false
  }
}

const supabaseUrl = [
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].find(isSupabaseUrl)

if (!supabaseUrl) {
  throw new Error("Missing a valid Supabase URL in public environment variables")
}

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
