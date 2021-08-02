const express = require('express')
const ytdl    = require('ytdl-core');
const cors    = require('cors')
const fs      = require('fs');


const app = express()

app.use(cors())
app.use(express.json())

const port = 2020


/* ytdl('https://www.youtube.com/watch?v=q783rNIwc70')
  .pipe(fs.createWriteStream('video.mp4')); */

app.post('/', async function(req, res){
    const URL = req.body.url

    try{
        let info = await ytdl.getInfo(URL)
        let video = ytdl.chooseFormat(info.formats, { 
            hasAudio: true,
            hasVideo: true
         })

        res.json({info: info, video: video})
    }catch(err){
        console.error(err)
    }
})

app.post('/music', function(req, res){
    const URL = req.body.url
    const title = req.body.title

    console.log('Start download~~~')
    

    let audio = ytdl(URL, {
        filter: 'audioonly'
    }).pipe(fs.createWriteStream(`../client/dist/download/${title}.mp3`))
    console.log('Download complete~~~')

    audio.on('finish', ()=>{
        res.json('Download complete')
        console.log('Delete file')
        setTimeout(()=>{
            fs.unlink(`../client/dist/download/${title}.mp3`, function(err){
                if (err) throw err
                console.log('File delete')
            })
        }, 2000)
    })
    
})

app.use(express.static('../client/dist'))


app.listen(port, ()=>{
    console.log(`Server sstart on PORT: ${port}`)
})