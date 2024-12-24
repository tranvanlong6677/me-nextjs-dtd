module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:@tanstack/query/recommended",
  ],
  rules: {
    "prettier/prettier": ["warn"],
  },
};
