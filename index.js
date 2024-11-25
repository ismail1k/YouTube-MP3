import readline from 'readline'
import cliProgress from 'cli-progress'
import ytdl from '@distube/ytdl-core'
import fs from 'fs'
import os from 'os'
import path from 'path'
import dotenv from 'dotenv'

class MP3 {
    constructor() {
        dotenv.config()
    }

    async prompt() {
        const query = 'Paste YouTube Link: '
        const instance = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        this.link = await new Promise((resolve) => {
            instance.question(query, (answer) => {
                resolve(answer)
                instance.close()
            })
        })
    }

    async download() {
        try {
            const info = await ytdl.getInfo(this.link)
            const title = info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '')
            const totalLength = parseInt(info.formats.find(f => f.audioBitrate).contentLength || 0, 10)
            const audioStream = ytdl(this.link, {
                filter: 'audioonly',
                quality: 'highestaudio',
            })

            let audioFilePath
            if(process.env.SAVE_LOCATION) audioFilePath = `${process.env.SAVE_LOCATION}/${title}.mp3`
            else audioFilePath = path.join(os.homedir(), 'Music', `${title}.mp3`)
            console.log('audioFilePath: '+audioFilePath)
            const audioFile = fs.createWriteStream(audioFilePath)

            const progressBar = new cliProgress.SingleBar({
                format: 'Downloading [{bar}] {percentage}% | {currentSize}/{totalSize}',
            }, cliProgress.Presets.shades_classic)

            let downloaded = 0

            const formatSize = (bytes) => {
                if (bytes < 1024) return `${bytes} B`
                if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
                return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
            }

            progressBar.start(100, 0, {
                currentSize: '0 MB',
                totalSize: formatSize(totalLength),
                title: title,
            })

            audioStream.on('data', (chunk) => {
                downloaded += chunk.length
                progressBar.update((downloaded / totalLength) * 100, {
                    currentSize: formatSize(downloaded),
                })
            })

            audioStream.on('error', (err) => {
                console.error('Stream error:', err)
                progressBar.stop()
            })

            audioStream.pipe(audioFile)

            await new Promise((resolve, reject) => {
                audioFile.on('finish', async () => {
                    progressBar.stop()
                    resolve()
                })
                audioFile.on('error', (err) => {
                    progressBar.stop()
                    reject(err)
                })
            })

        } catch (error) {
            console.error('Error during download:', error.message)
        }
    }

}

(async () => {
    while (true) {
        // console.clear()
        const instance = new MP3()
        await instance.prompt()
        await instance.download()
    }
})()
