import type { Express } from "express";
import { createServer, type Server } from "http";
import { scanWebsite } from "./accessibility-scanner";
import { scanRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/scan", async (req, res) => {
    try {
      const parseResult = scanRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Invalid URL format. Please enter a valid website URL.",
        });
      }

      const { url, mode } = parseResult.data;
      const result = await scanWebsite(url, mode);
      
      return res.json(result);
    } catch (error) {
      console.error("Scan error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("CORS") || error.message.includes("blocked")) {
          return res.status(403).json({
            message: "This website blocks automated scanning due to security restrictions.",
          });
        }
        if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
          return res.status(504).json({
            message: "The website took too long to respond. Please try again.",
          });
        }
        if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
          return res.status(404).json({
            message: "Website not found. Please check the URL and try again.",
          });
        }
        if (error.message.includes("certificate") || error.message.includes("SSL")) {
          return res.status(502).json({
            message: "Unable to establish a secure connection to the website.",
          });
        }
        
        return res.status(500).json({
          message: error.message || "Failed to scan website. Please try again.",
        });
      }
      
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  });

  return httpServer;
}
