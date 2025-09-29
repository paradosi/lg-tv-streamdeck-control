process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const LGTV = require("lgtv2");
const TV_IP = "10.10.1.224";

function connectAndListInputs() {
  return new Promise((resolve, reject) => {
    console.log("[INFO] Connecting to TV to list available inputs...");
    const lgtv = new LGTV({ url: `wss://${TV_IP}:3001`, timeout: 10000, reconnect: false });

    lgtv.on("error", e => {
      console.log(`[ERROR] Connection failed: ${e.message}`);
      reject(e);
    });

    lgtv.on("connect", () => {
      console.log("[SUCCESS] Connected to TV");

      // Get list of inputs
      lgtv.request("ssap://tv/getExternalInputList", {}, (err, inputs) => {
        if (err) {
          console.log(`[ERROR] Failed to get inputs: ${err}`);
          lgtv.disconnect();
          reject(err);
          return;
        }

        console.log("[INFO] Available inputs:");
        inputs.devices.forEach(device => {
          console.log(`  - ID: "${device.id}", Label: "${device.label}", Connected: ${device.connected}`);
        });

        lgtv.disconnect();
        resolve(inputs);
      });
    });

    setTimeout(() => {
      console.log("[ERROR] Connection timeout");
      try { lgtv.disconnect(); } catch {}
      reject(new Error("Timeout"));
    }, 15000);
  });
}

(async () => {
  try {
    await connectAndListInputs();
  } catch (e) {
    console.error(`[FINAL ERROR] ${e.message}`);
    process.exit(1);
  }
})();