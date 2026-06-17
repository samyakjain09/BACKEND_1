const ImageKit=require("@imagekit/nodejs").default
const { toFile } = require("@imagekit/nodejs")

const client=new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY?.trim(),
})

async function uploadFile(buffer,fileName,folder=""){
    const file= await client.files.upload({
        file:await toFile(buffer, fileName),
        fileName:fileName,
        folder:folder
    })
    return file
}

module.exports={uploadFile}
