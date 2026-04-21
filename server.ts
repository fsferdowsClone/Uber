import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for driver registration & verification simulation
  app.post("/api/register-driver", async (req, res) => {
    const { email, fullName } = req.body;
    
    console.log(`[SIMULATION] Sending verification email to ${email} for ${fullName}...`);
    
    // Simulate some logic
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({ 
      success: true, 
      message: "Verification email sent. Please check your inbox.",
      verificationToken: "simulated_token_" + Math.random().toString(36).substring(7)
    });
  });

  // Vite middleware for development
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
