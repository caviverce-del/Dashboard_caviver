import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configuração para suportar payloads de dados robustos (planilhas Excel convertidas com muitas colunas e linhas)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const DATA_FILE = path.join(process.cwd(), "database.json");

  // Endpoint para recuperar os dados carregados globais/centralizados
  app.get("/api/database", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        if (fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          return res.json({ status: "success", data: parsed });
        }
      }
      return res.json({ status: "empty", data: null });
    } catch (error) {
      console.error("Erro ao ler banco de dados do servidor:", error);
      return res.status(550).json({ status: "error", message: "Erro ao ler base de dados" });
    }
  });

  // Endpoint para salvar a última base de dados na nuvem da CAVIVER
  app.post("/api/database", (req, res) => {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ status: "error", message: "Estrutura de dados inválida para salvar" });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
      return res.json({ status: "success" });
    } catch (error) {
      console.error("Erro ao gravar banco de dados:", error);
      return res.status(500).json({ status: "error", message: "Erro ao gravar dados no servidor" });
    }
  });

  // Endpoint para excluir a base de dados do backup central
  app.delete("/api/database", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
      }
      return res.json({ status: "success" });
    } catch (error) {
      console.error("Erro ao limpar banco de dados do servidor:", error);
      return res.status(500).json({ status: "error", message: "Erro ao redefinir base de dados" });
    }
  });

  // Integração com o Vite Middleware (Vite renderiza no dev, ou serve a pasta dist em prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
