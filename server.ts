import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function contactRateLimit(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again later.",
    });
  }

  entry.count++;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post("/api/contact", contactRateLimit, async (req, res) => {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required values: 'name', 'email', and 'message' are mandatory.",
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromAddress =
      process.env.RESEND_FROM ||
      "Griffin LeBlanc Portfolio <notifications@mail.griffinleblanc.ca>";
    const toAddress = "griffin.leblanc@gmail.com";

    if (!resendKey || resendKey === "re_123456789") {
      console.log("RESEND_API_KEY is not defined. Responding in simulation mode.");
      return res.json({
        success: true,
        mode: "simulation",
        message: "Message received in simulation mode.",
      });
    }

    try {
      const resendObj = new Resend(resendKey);
      const safeName = escapeHtml(String(name));
      const safeEmail = escapeHtml(String(email));
      const safeCompany = escapeHtml(String(company || "None"));
      const safeMessage = escapeHtml(String(message));

      const payload = {
        from: fromAddress,
        to: toAddress,
        subject: `New Portfolio Message: ${name} from ${company || "New Client"}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "None"}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #1c1c1f; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0ea5e9; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 0;">Portfolio Briefing</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 8px 0;"><strong>Company:</strong> ${safeCompany}</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #38bdf8; white-space: pre-line; line-height: 1.6;">
              ${safeMessage}
            </div>
          </div>
        `,
      };

      const mailData = await resendObj.emails.send(payload);

      if (mailData.error) {
        console.error("Resend API returned error status:", mailData.error);
        return res.status(500).json({
          success: false,
          error: mailData.error.message || "Failed to send message.",
        });
      }

      console.log(`Resend email sent successfully! ID: ${mailData.data?.id}`);
      return res.json({
        success: true,
        mode: "live",
        message: "Message sent successfully.",
        id: mailData.data?.id,
      });
    } catch (error: any) {
      console.error("Resend transmission failure:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to send message.",
      });
    }
  });

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
    console.log(`Server launched and ready on http://localhost:${PORT}`);
  });
}

startServer();
