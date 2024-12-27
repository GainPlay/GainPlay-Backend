if (process.env.npm_execpath.indexOf("bun") === -1) {
  console.error("You must use Bun");
  process.exit(1);
}
