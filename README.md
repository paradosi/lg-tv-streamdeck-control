# LG TV Stream Deck Control

Control your LG webOS TV input switching with Stream Deck buttons. Switch between HDMI inputs instantly without using the TV remote.

## ✨ Features

- **Instant Input Switching**: Switch between HDMI inputs with a single button press
- **Silent Operation**: No terminal windows or visible output
- **Reliable Connection**: Uses LG's webOS API for stable communication
- **Easy Setup**: Minimal configuration required

## 🔧 Requirements

- **LG webOS TV** (tested on OLED42C2PUA with webOS 9.2.2-61)
- **Stream Deck** (any model)
- **macOS** with Node.js installed
- **Network Connection** (TV and computer on same network)

## 📋 TV Settings Required

Your LG TV must have these settings enabled:

1. **TV On With Mobile**
   - Navigate to: Settings → General → External Devices → TV On With Mobile
   - Enable: "Turn on via Wi-Fi" ✅

2. **Network IP Control**
   - Navigate to: Settings → Support → IP Control Settings
   - Enable: "Network IP Control" ✅

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/lg-tv-streamdeck-control.git
   cd lg-tv-streamdeck-control
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure TV IP Address**

   Edit `scripts/switch-only.js` and update the TV_IP constant:
   ```javascript
   const TV_IP = "10.10.1.224"; // Change to your TV's IP address
   ```

4. **Test the connection**
   ```bash
   node scripts/list-inputs.js
   ```
   This should show your TV's available inputs.

## 🎮 Stream Deck Setup

1. **Add System: Open actions** to your Stream Deck buttons

2. **For HDMI 2 button:**
   - Action: System → Open
   - App/File: `/path/to/lg-tv-streamdeck-control/streamdeck/hdmi2-final.sh`

3. **For HDMI 4 button:**
   - Action: System → Open
   - App/File: `/path/to/lg-tv-streamdeck-control/streamdeck/hdmi4-final.sh`

4. **Make scripts executable** (if needed):
   ```bash
   chmod +x streamdeck/hdmi2-final.sh streamdeck/hdmi4-final.sh
   ```

## 🔍 How It Works

The solution uses LG's webOS API to communicate with your TV over the local network. Key technical details:

- **Protocol**: WebSocket Secure (WSS) on port 3001
- **API Endpoints**: Uses `ssap://system.launcher/launch` with specific app IDs
- **App IDs**:
  - HDMI 2: `com.webos.app.hdmi2`
  - HDMI 4: `com.webos.app.hdmi4`
- **Authentication**: Uses TV's built-in pairing system

## 🛠 Troubleshooting

### TV Not Switching
1. Verify TV settings are enabled (see requirements above)
2. Check TV IP address in configuration
3. Ensure TV and computer are on same network
4. Test manual switching: `node scripts/switch-only.js HDMI_2`

### Connection Issues
- Make sure TV is powered on
- Verify firewall isn't blocking connection
- Try running: `node scripts/list-inputs.js` to test connectivity

### Stream Deck Issues
- Verify script paths are absolute (not relative)
- Check script permissions: `ls -la streamdeck/`
- Test scripts manually in terminal first

## 📁 Project Structure

```
lg-tv-streamdeck-control/
├── README.md
├── package.json
├── scripts/
│   ├── switch-only.js      # Main switching logic
│   └── list-inputs.js      # TV input discovery
└── streamdeck/
    ├── hdmi2-final.sh      # HDMI 2 Stream Deck script
    └── hdmi4-final.sh      # HDMI 4 Stream Deck script
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - feel free to use and modify as needed.

## 🙏 Acknowledgments

- Built using the [lgtv2](https://www.npmjs.com/package/lgtv2) Node.js library
- Inspired by the need for better Stream Deck TV control