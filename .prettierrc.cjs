module.exports = {
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 80,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^next(.*)",
    "^react(.*)",
    "<THIRD_PARTY_MODULES>",
    "@(.*)",
    "^[.]",
  ],
};
