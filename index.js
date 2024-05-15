const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');


const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(bodyParser.json());
app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));


// simple route
app.get('/', (req, res) => {
    res.json({ message: 'Hello world from Practice Service' });
});

const mathjax = require('mathjax-node')
mathjax.start()
app.post('/math', async (req, res, next) => {
    try {
        const rawString = req.body.tex
        await mathjax.typeset({
            math: rawString,
            format: "TeX",
            mml: true,
        }, (data) => {
            res.status(200).json({
                result: data.mml
            })
        })
    } catch (err) {
        next(err)
    }
})

// handle error request
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({
        message: message,
        success: false,
        data: data,
    });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});