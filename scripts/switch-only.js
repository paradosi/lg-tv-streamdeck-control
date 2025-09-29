process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const LGTV = require("lgtv2");

const VERSION = "switch-only-v1.0";
const TV_IP = "10.10.1.224";
const TARGET = (process.argv[2] || "HDMI_2").toUpperCase();
const CONNECTION_TIMEOUT = 10000;

function connectAndSwitch(url) {
  return new Promise((resolve, reject) => {
    let finished = false;
    console.log(`[DEBUG] Attempting connection to ${url}`);
    const lgtv = new LGTV({ url, timeout: CONNECTION_TIMEOUT, reconnect: false });

    function end(err) {
      if (finished) return;
      finished = true;
      try { lgtv.disconnect(); } catch {}
      if (err) {
        console.log(`[ERROR] Connection failed: ${err.message || err}`);
        reject(err);
      } else {
        console.log(`[SUCCESS] Successfully switched to ${TARGET} via ${url}`);
        resolve();
      }
    }

    lgtv.on("error", e => {
      console.log(`[ERROR] LGTV error on ${url}: ${e?.message || e}`);
      end(new Error("Connection error: " + (e?.message || e)));
    });

    lgtv.on("prompt", () => {
      console.log("[INFO] Pairing prompt shown on TV - please approve if displayed");
    });

    lgtv.on("connect", () => {
      console.log(`[SUCCESS] Connected to TV via ${url}, attempting input switch...`);
      // Use specific webOS app IDs for reliable switching
      const appId = TARGET === "HDMI_2" ? "com.webos.app.hdmi2" : "com.webos.app.hdmi4";
      lgtv.request("ssap://system.launcher/launch", { id: appId }, (err) => {
        if (!err) {
          console.log(`[SUCCESS] Input switched to ${TARGET} using webOS app ${appId}`);
          return end();
        }
        console.log(`[INFO] webOS app method failed, trying generic launcher...`);
        lgtv.request("ssap://system.launcher/launch", { id: TARGET }, (err2) => {
          if (err2) {
            console.log(`[ERROR] Both webOS app and launcher failed: ${err2}`);
          } else {
            console.log(`[SUCCESS] Input switched to ${TARGET} using generic launcher`);
          }
          end(err2);
        });
      });
    });

    setTimeout(() => {
      console.log(`[ERROR] Connection timeout after ${CONNECTION_TIMEOUT}ms via ${url}`);
      end(new Error("Timeout via " + url));
    }, CONNECTION_TIMEOUT + 2000);
  });
}

(async () => {
  console.log(`[INFO] (${VERSION}) Starting fast input switch - target=${TARGET}`);

  try {
    // Try secure WSS first
    await connectAndSwitch(`wss://${TV_IP}:3001`);
    console.log(`[FINAL SUCCESS] (${VERSION}) Input switch completed successfully!`);
    process.exit(0);
  } catch (e1) {
    console.log(`[WARN] WSS connection failed: ${e1.message}`);
    try {
      // Fallback to plain WS
      await connectAndSwitch(`ws://${TV_IP}:3000`);
      console.log(`[FINAL SUCCESS] (${VERSION}) Input switch completed successfully!`);
      process.exit(0);
    } catch (e2) {
      console.error(`[FINAL ERROR] Both WSS and WS failed:\nWSS: ${e1.message}\nWS: ${e2.message}`);
      process.exit(1);
    }
  }
})();