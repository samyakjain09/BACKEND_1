import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from 'fs';

const dataBuffer = fs.readFileSync('./story.pdf');
const parser=new PDFParse({
    data:dataBuffer
})
const data=await parser.getText()
console.log(data)

const splitter=new RecursiveCharacterTextSplitter({
    chunkSize:10,
    chunkOverlap:0,
})