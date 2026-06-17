const songmodel=require("../models/song.model")
const id3=require("node-id3")
const storageService=require("../services/storage.service")

async function uploadSong(req,res){
    const { mood } = req.body

    if (!req.file?.buffer) {
        return res.status(400).json({
            message: "song file is required"
        })
    }

    const songBuffer=req.file.buffer
    const tags=id3.read(songBuffer)
    const title = tags.title || req.file.originalname.replace(/\.[^/.]+$/, "")

    const songFile=await storageService.uploadFile(
        songBuffer,
        title +".mp3",
        "/cohort2/moodify/songs"
    )

    let posterUrl = ""

    if (tags.image?.imageBuffer) {
        const posterFile=await storageService.uploadFile(
            tags.image.imageBuffer,
            title +".jpeg",
            "/cohort2/moodify/posters"
        )
        posterUrl = posterFile.url
    }

    const song=await songmodel.create({
        type:req.file.mimetype,
        url:songFile.url,
        title:title,
        posterUrl:posterUrl,
        mood
    })

    res.status(201).json({
        message:"song uploaded successfully",
        song
    })
}

async function getSongs(req,res){
    const {mood}=req.query
    const song=await songmodel.findOne({mood})

    if (!song) {
        return res.status(404).json({
            message:"no song found for this mood"
        })
    }

    res.status(200).json({
        message:"songs fetched successfully",
        song
    })

}

module.exports={uploadSong,getSongs}
