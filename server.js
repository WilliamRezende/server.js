const http = require("http");
const url = require("url"); //permite "resolver"
const fs = require("fs"); // interação com sistemas de arquivos
const path = require("path"); // lidar com caminho de arquivos, estensões
const { Console } = require("console");

const hostname = "127.0.0.1";
const port = 3000;

//media type

const mimeTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  woff: "font/woff",
};

http
  .createServer((req, res) => {
    let acesso_uri = url.parse(req.url).pathname;
    let caminho_completo_recurso = path.join(
      process.cwd(),
      decodeURI(acesso_uri)
    );
    console.log(caminho_completo_recurso);

    let recurso_carregado;
    try {
      recurso_carregado = fs.lstatSync(caminho_completo_recurso);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("Arquivo não encontrato!");
      res.end();
    }

    try {
      if (recurso_carregado.isFile()) {
        try {
          let mimeType =
            mimeTypes[path.extname(caminho_completo_recurso).substring(1)];

          res.writeHead(200, { "Content-Type": mimeType });
          let fluxo_arquivo = fs.createReadStream(caminho_completo_recurso);
          return fluxo_arquivo.pipe(res);
        } catch (error) {
          console.log(`Ocorreu um erro na aplicação: ${error}`);
        }
      } else if (recurso_carregado.isDirectory()) {
        res.writeHead(302, { Location: "index.html" });
        res.end();
      } else {
        res.writeHead(500, { "Content-Type": "test/plain" });
        res.write("500: Erro interno do Servidor!");
        res.end();
      }
    } catch (error) {
      console.log(`Ocorreu um erro na aplicação: ${error}`);
    }
  })
  .listen(port, hostname, () => {
    console.log(`Server is running at https://${hostname}:${port}/`);
  });
