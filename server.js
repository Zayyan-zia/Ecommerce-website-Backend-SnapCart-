const express=require('express');
const mongoose=require('mongoose');
const multer=require('multer');
require('dotenv').config();
const nodemailer=require('nodemailer');
const app=express();
const FuseModule = require('fuse.js');
const Fuse = FuseModule.default || FuseModule;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transport = nodemailer.createTransport({
  host: process.env.email_hostname,
  port: 465,
  secure: true,
  auth: {
    user: process.env.email_username,
    pass: process.env.email_passname, 
  },
});

mongoose.connect(process.env.mongodb_connectionname)
.then((res)=>{
    console.log('successfully db connected');
});
const userschema=new mongoose.Schema({
    title:String,
    description:String,
    price:String,
    quantity:String,
    fileimage:Buffer,
    filemimetype:String,
});

const mainpageproduct=mongoose.model('products-infos',userschema);
const shoesproduct=mongoose.model('products-category-shoses',userschema);
const accessoriesproduct=mongoose.model('products-category-accessories',userschema);

const multerstorage=multer.memoryStorage()


const upload=multer({
    storage:multerstorage,
});

app.get('/',(req,res,next)=>{
    res.send('multer file uploading');
})

app.post('/submit',upload.single('imgfile'),async(req,res,next)=>{
    const file=req.file.buffer;
    const {title,description,price,quantity}=req.body;
    let data= await accessoriesproduct.create({
       title,
       description,
       price,
       quantity,
       fileimage:file,
       filemimetype:req.file.mimetype
});
res.send('data inserted')
})

app.get('/mainpageproduct',async(req,res,next)=>{
      const data = await mainpageproduct.find().lean();
  res.send(data);
});

app.get('/shoesproduct',async (req,res,next)=>{
    const shoesdata= await shoesproduct.find().lean();
    res.send(shoesdata);
});

app.get('/accessoriesproduct',async (req,res,next)=>{
    const accessoriesdata= await accessoriesproduct.find().lean();
    res.send(accessoriesdata);
})

app.get('/allproductimages/:id',async(req,res,next)=>{
       let id=req.params.id;
       let image1= await mainpageproduct.findById(id);
       let image2= await shoesproduct.findById(id);
       let image3= await accessoriesproduct.findById(id);
       if(image1){
        res.set('Content-type',image1.filemimetype)
        res.send(image1.fileimage)
       }
       else if(image2){
         res.set('Content-type',image2.filemimetype)
        res.send(image2.fileimage)
       }
       else{
        res.set('Content-type',image3.filemimetype)
        res.send(image3.fileimage)
       }
});

app.post('/contact',upload.none(),async (req,res,next)=>{
  const {contactname,contactemail,contactsubject,contactphoneno,contactissue}=req.body;
  const email = {
    from: process.env.email_from,
    to: contactemail,
    subject: 'Thanks for contacting us!',
    text: `Hi ${contactname},\n\nThank you for reaching out to us. We have received your message and will get back to you soon.\n\nSubject: ${contactsubject}\nMessage: ${contactissue}\n\nBest regards,\nZstyles Team`,
    html: `
      <p>Hi <strong>${contactname}</strong>,</p>
      <p>Thank you for reaching out to us. We’ve received your inquiry and will respond as soon as possible.</p>
      <p><strong>Your message:</strong></p>
      <ul>
        <li><strong>Subject:</strong> ${contactsubject}</li>
        <li><strong>Issue:</strong> ${contactissue}</li>
        <li><strong>Phone:</strong> ${contactphoneno}</li>
      </ul>
      <p>Best regards,<br><strong>Zstyles Team</strong></p>
    `
  };

  try{
   await transport.sendMail(email);
    res.status(200);
  }
  catch (err){
     res.status(500);
  }

})

app.post('/signup',upload.none(),async(req,res,next)=>{
    const{signupname,signupemail}=req.body;
  const email = {
  from: process.env.email_from, 
  to: signupemail, 
  subject: "Welcome to SnapCart!",
  html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome, ${signupname}!</h2>
      <p>Thank you for signing up at <strong>SnapCart</strong>.</p>
      <p>Your account has been successfully created with the following email: <strong>${signupemail}</strong>.</p>
      <p>You're now ready to explore everything we offer.</p>
      <hr>
      <p>If you did not sign up for this account, please ignore this email or contact our support.</p>
      <p>Best regards,<br>Zstyles Team</p>
    </div>
  `
};

    
    try{
        await transport.sendMail(email);
        res.status(200);
    }
    catch(err){
        res.status(500);
    }

})

app.post('/search-product',upload.none(),async(req,res,next)=>{
    const name=req.body.query.toLowerCase();

    
       let products1= await mainpageproduct.find();
       let products2= await shoesproduct.find();
       let products3= await accessoriesproduct.find();
       const products=[...products1,...products2,...products3];
       const options={
        keys:['title'],
        threshold: 0.4
       };
       const response= new Fuse(products ,options);
      const answer = response.search(name)
res.send(answer);
    });

app.get('/detail-product/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    let product = await mainpageproduct.findById(id);
    if (product) return res.send(product);

    product = await shoesproduct.findById(id);
    if (product) return res.send(product);

    product = await accessoriesproduct.findById(id);
    if (product) return res.send(product);

    res.status(404).send({ error: 'Product not found' });
  } catch (err) {
    next(err);
  }
});

app.get('/checkout/:id',async(req,res,next)=>{
    try {
    const id = req.params.id;

    let product = await mainpageproduct.findById(id);
    if (product) return res.send(product);

    product = await shoesproduct.findById(id);
    if (product) return res.send(product);

    product = await accessoriesproduct.findById(id);
    if (product) return res.send(product);

    res.status(404).send({ error: 'Product not found' });
  } catch (err) {
    next(err);
  }
  
});

app.post('/orderconfirm',upload.none(),(req,res,next)=>{
          const{name,email,address,city,country,zipcode,productname,total}=req.body;
            const emails = {
    from: process.env.email_from,
    to: email,
    subject: `Order Confirmation - Thank you for your purchase!`,
    text: `Hi ${name}`,
     html: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for your order! We’ve received it and will begin processing shortly.</p>
      
      <h3>🧾 Order Details</h3>
      <ul>
        <li><strong>Product:</strong> ${productname}</li>
        <li><strong>Quantity:</strong> 1</li>
        <li><strong>Total:</strong>Rs: ${total}</li>
      </ul>

      <h3>📦 Shipping To</h3>
      <p>
        ${address}<br>
        ${city}, ${zipcode}<br>
        ${country}
      </p>

      <p>We’ll notify you once your order ships. If you have any questions, just reply to this email.</p>

      <p>Best regards,<br><strong>Zstyles Team</strong></p>
    `
  };

  transport.sendMail(emails,(error,info)=>{
    if(error){
      res.status(200);
    }
    else{
      res.status(500);
    }
  })

});
const port=process.env.PORT || 3001
app.listen(port,()=>{
    console.log(`server star at port ${port}`);
})
