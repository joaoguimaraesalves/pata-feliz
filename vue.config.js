const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // Em produção (GitHub Pages) os arquivos ficam em /<nome-do-repo>/.
  // Ajuste "pata-feliz" para o nome exato do seu repositório no GitHub.
  publicPath: process.env.NODE_ENV === "production" ? "/pata-feliz/" : "/",
});
