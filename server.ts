import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and urlencoded body decoding
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API contact submission endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required values: 'name', 'email', and 'message' are mandatory." 
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.RESEND_FROM || "Griffin LeBlanc Portfolio <notifications@mail.griffinleblanc.ca>";
    const toAddress = "griffin.leblanc@gmail.com";

    if (!resendKey || resendKey === "re_123456789") {
      // Lazy fallback handling: handle missing key gracefully by returning mock simulation success response state
      console.log("RESEND_API_KEY is not defined. Responding with Simulation payload.");
      return res.json({
        success: true,
        mode: "simulation",
        message: "Simulated dispatch accepted.",
        advisory: "RESEND_API_KEY is not registered in secrets. Message processed via mock offline-buffer pipelines.",
        dispatchResult: {
          from: fromAddress,
          to: toAddress,
          subject: `Offline Sandbox: Contact Request [${company || "Private Client"}]`,
          body: `SenderName: ${name}\nSenderEmail: ${email}\nMessageLength: ${message.length} chars`
        }
      });
    }

    try {
      const resendObj = new Resend(resendKey);

      // Free tier bounds validation defaults
      const payload = {
        from: fromAddress,
        to: toAddress,
        subject: `New Portfolio Message: ${name} from ${company || "New Client"}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "None"}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #1c1c1f; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0ea5e9; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 0;">Portfolio Briefing</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Company:</strong> ${company || "None"}</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #38bdf8; white-space: pre-line; line-height: 1.6;">
              ${message}
            </div>
          </div>
        `
      };

      const mailData = await resendObj.emails.send(payload);

      if (mailData.error) {
        console.error("Resend API returned error status:", mailData.error);
        return res.status(500).json({
          success: false,
          error: mailData.error.message || "Failed to trigger email stream."
        });
      }

      console.log(`Resend email sent successfully! ID: ${mailData.data?.id}`);
      return res.json({
        success: true,
        mode: "live",
        message: `Message successfully transmitted to ${toAddress}!`,
        id: mailData.data?.id
      });
    } catch (error: any) {
      console.error("Resend transmission failure:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "An exception occurred during client mailing pipelines verification."
      });
    }
  });

  // Serve static assets or mount Vite process middleware based on environment
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
