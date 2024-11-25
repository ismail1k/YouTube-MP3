
# YouTube MP3 Downloader

A Node.js script to download audio from YouTube videos with a custom save locations.

## Features
- Downloads high-quality audio-only files.
- Tracks download progress with a bar showing percentage and size (MB/KB).
- Saves files to `Music` folder or a custom directory.

## Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/ismail1k/YouTube-MP3.git
   cd YouTube-MP3
   npm install
   ```

2. Run the script:
   ```bash
   node index.js
   ```

## Custom Save Location
Set `SAVE_LOCATION` environment variable on `.env` file.
By default, files are saved to the `Music` folder.
