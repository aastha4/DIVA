const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://aastha:aasthappassword@cluster0.oextlx6.mongodb.net/DIVA")

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})  

const upload = multer({storage:storage})
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }, 
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    sizes: { type: [String], default: []},
    available: { type: Boolean, default: true },
    views: { type: Number, default: 0 } // New field to track views
});
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        
        // Create a new product with sizes included
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            sizes: req.body.sizes || [], // Handle sizes field
        });

        // Save the product to the database
        await product.save();
        
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

app.post("/removeproduct", async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, name: req.body.name });
});

// Get all products
app.get("/allproducts", async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

// Schema for users
const Users = mongoose.model('Users', {
    name: { type: String }, 
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now },
    views: {
        type: Number,
        default: 0, // Default view count
    }
});

// Register user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same Email Id" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });
    await user.save(); 
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

// Login user
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = { user: { id: user.id } };
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: 'Wrong Password' });
        }
    } else {
        res.json({ success: false, errors: "Wrong Email Id" });
    }
});

// Get new collections
app.get("/newcollections", async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
});

// Get popular products in women category
app.get('/popularinwomen', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popularInWomen = products.slice(0, 4);
        res.send(popularInWomen);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Fetch user middleware
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "please authenticate using valid token" });
        }
    }
};

// Add to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    
    // Increment the view count for the product
    await Product.findOneAndUpdate({ id: req.body.itemId }, { $inc: { views: 1 } });
    
    res.send("Added");
});
// Get recommended products based on most views
app.get('/recommended', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ views: -1 }).limit(4); // Top 4 most viewed products
        res.send(products);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


// Remove from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
});

// Get cart data
app.post("/getcart", fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

// Get recommended products based on most views
app.get('/recommended', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ views: -1 }).limit(10); // Top 10 most viewed products
        res.send(products);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port); 
    } else {
        console.log("Error: " + error);
    }
});
