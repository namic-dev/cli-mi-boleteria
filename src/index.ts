import { startPrompt } from "./cli"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  while (true) {
    await startPrompt()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
