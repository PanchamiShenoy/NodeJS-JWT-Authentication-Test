const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');


app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 5000;
const secretKey = "my secret key";
const jwtMW = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'Panchami',
        password: '123'
    }, 
    {
        id: 2,
        username: 'Shenoy',
        password: '456'
    }
];

app.post('/api/login', (req, res)=> {
    const { username, password} = req.body;
    
    for(let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({id:  user.id, username: user.username}, secretKey,{expiresIn: 180});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'username or password is incorrect',
                
            });
        }
    }



    console.log('This is me', username, password);
    res.json({data:'it works'});
});

app.get('/api/dashboard', jwtMW,(req, res)=> {
    res.json({
        success: true,
        myContent: 'secret conetnt that only logged in people can see'
    })
});

app.get('/api/settings', jwtMW,(req, res)=> {
    res.json({
        success: true,
        myContent: 'Settings Screen'
    })
});

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.use(function(err,req,res,next) {
    if(err.name == 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            err
    });
}
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`serving on port ${PORT}`);
})