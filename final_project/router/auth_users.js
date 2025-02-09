const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [    {
    "username": "batata",
    "password": "1234678"
},
{
    "username": "batman",
    "password": "1234678"
},
{
    "username": "golio",
    "password": "1234678"
}];

const isValid = (username)=>{ 
  
    if(username.trim() == "" || username == null){
        return false;
    }else{
        return true;

    };
}

const authenticatedUser = (username,password)=>{ 
    if(users.filter((user)=>user.username===username && user.password===password).length > 0){
        return true;
    }else{

        return false;
    };
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("login success :" + accessToken);
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
const isbn = req.params.isbn;

let filter_review=books[isbn].reviews;
const test_object=Object.values(filter_review).filter((user)=>user.username);

if(test_object.length > 0){
    books[isbn].reviews[req.body.username] = {
        "username": req.body.username,
        "titre": req.body.titre,
        "description": req.body.description
      };
 

}else{
   
    

    books[isbn].reviews[req.body.username] = {
      "username": req.body.username,
      "titre": req.body.titre,
      "description": req.body.description
    };
    
  
}
res.send(books[isbn].reviews)

});
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let filter_review=books[isbn].reviews;
    
   

    if(books[isbn].reviews[req.body.username] != {}){
      delete  books[isbn].reviews[req.body.username];
    }else{

    };


res.send(books[isbn].reviews)
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
