// Local stand-in for the Resend API, for end-to-end form tests.
// Usage: node scripts/mock-resend.mjs [port] [status]
import http from "node:http";

const port = Number(process.argv[2] || 3999);
const status = Number(process.argv[3] || 200);

http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        const j = JSON.parse(body);
        const summary = {
          auth: req.headers.authorization,
          url: req.url,
          from: j.from,
          to: j.to,
          reply_to: j.reply_to,
          subject: j.subject,
          textStart: String(j.text).slice(0, 120),
          attachments: (j.attachments || []).map((a) => ({ filename: a.filename, bytes: Buffer.from(a.content, "base64").length })),
        };
        console.log("MOCK RECEIVED", JSON.stringify(summary));
      } catch {
        console.log("MOCK RECEIVED (unparsed)", body.slice(0, 200));
      }
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(status === 200 ? { id: "mock-email-id" } : { message: "mock failure" }));
    });
  })
  .listen(port, () => console.log(`mock resend on ${port} returning ${status}`));
