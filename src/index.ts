import { startPrompt } from "./cli"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  while (true) {
    await startPrompt()
  }
}

main().catch(() => {
  console.log("Existe un problema con mi boleteria 😢. Intentá más tarde.")
  process.exit(1)
})
