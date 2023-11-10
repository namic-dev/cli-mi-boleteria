/** @type {import("@trivago/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  importOrder: ["<THIRD_PARTY_MODULES>", "^[.~].*$"],
  importOrderSeparation: true,
  trailingComma: "all",
  semi: false,
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
}

module.exports = config
