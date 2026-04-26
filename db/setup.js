const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envFile = path.join(__dirname, "../.env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf8").split("\n").forEach(line => {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  });
}

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "asset_valet",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

async function setup() {
  console.log("\n🔄 Setting up Asset Valet database...\n");
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  try {
    await pool.query(sql);
    console.log("✅ Tables created successfully");
    console.log("✅ Sample data inserted (8 users, 20 assets, 10 assignments, 8 reports)\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 LOGIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  👑 Admin    → admin       / Admin@123");
    console.log("  👤 Employee → sara.khan   / Pass@123");
    console.log("  👤 Employee → john.doe    / Pass@123");
    console.log("  👤 Employee → priya.sharma/ Pass@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🚀 Run: npm run dev → http://localhost:3000\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.message.includes("database") && err.message.includes("does not exist")) {
      console.log('\n💡 Create the DB first:');
      console.log('   cd "C:\\Program Files\\PostgreSQL\\16\\bin"');
      console.log('   psql -U postgres -c "CREATE DATABASE asset_valet;"');
    }
    if (err.message.includes("password")) {
      console.log('\n💡 Wrong password — edit .env.local and set DB_PASSWORD=your_password');
    }
  } finally {
    await pool.end();
  }
}
setup();
