import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

async function runMigrations() {
  console.log("🚀 Aplicando migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations aplicadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao aplicar migrations:", error);
    process.exit(1);
  }
}

runMigrations();
