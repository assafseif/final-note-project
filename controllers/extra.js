import Category from '../models/category.js'
import User from '../models/user.js'
import Hashtag from '../models/hashtag.js'
import Note from '../models/note.js'



import PDFDocument from 'pdfkit'


export const Popular = async (req, res, next) => {
  

    var myDoc = new PDFDocument({bufferPages: true});
  
    let buffers = [];
    myDoc.on('data', buffers.push.bind(buffers));
    myDoc.on('end', () => {
  
        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=test.pdf',})
        .end(pdfData);
  
    });
    const hashtag=await Hashtag.find().sort({counter:-1})
    let avg=((hashtag.length)*20)/100;
    const avgLength=Math.ceil(avg)
    let display=[];

    for(let i=0;i<avgLength;i++){
        const number=i+1;
        const toDisplay = '#'+number+'-'+hashtag[i].title+'   :   '+hashtag[i].counter
        
        display.push(toDisplay)
    }
    
    myDoc.font('Times-Roman')
    .fontSize(12)
    .text(`TOP ${avgLength} POPULAR HASHTAGS`);
  
    for(let i=0;i<avgLength;i++){
        myDoc.font('Times-Roman')
        .fontSize(12)
        .text(display[i]);

    }
   

    myDoc.end();
  
  
  
  }