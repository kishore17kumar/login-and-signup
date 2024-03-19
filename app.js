const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const UserSchema= new mongoose.Schema({
    username:String,
    password:String
});

const User=mongoose.model('User',UserSchema);


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save()
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err));
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username, password: password })
        .then(user => {
            if (user) {
                res.send('Login Successful!');
            } else {
                res.send('Invalid username or password');
            }
        })
        .catch(err => console.log(err));
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
