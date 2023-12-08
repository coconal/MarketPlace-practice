import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { uploadFileToIPFS, uoloadJSONToIPFS } from './ipfs-uploader.js';
import dotenv from "dotenv"
dotenv.config(".env")
import { mint } from './nft-minter.js';

const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())


app.get('/', (req, res) => {
    res.render("home")
})

app.post("/upload", (req, res) => {
    const title = req.body.title
    const description = req.body.description
    //console.log(title, description)

    const file = req.files.file
    const filename = file.name
    const filePath = "files/" + filename

    file.mv(filePath, async (err) => {
        if (err) {
            console.log(err)
            res.status(500).send("error occured")
        }

        const fileResult = await uploadFileToIPFS(filePath)


        const fileCid = fileResult.cid.toString()
        const metaData = {
            title: title,
            description: description,
            image: process.env.IPFSPATH + fileCid
        }

        await mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", metaData.image)
        res.json(
            {
                message: "file uploaded",
                data: metaData
            }
        )


    })


})

app.listen(process.env.PORT, () => {
    console.log("port 3000")
})