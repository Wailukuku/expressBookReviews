const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    
const username=req.body.username;
const password = req.body.password;

if(isValid(username)){
    if(users.filter((user)=>user.username==username ).length >0){
        return  res.send('500', "le username existe déjà");
    }

    if(password.trim()=="" || password== null){
    res;send('500',"le passwor ne remplis pas les condition veuillez reassayer") ;

    }else{
        users.push(
            {"username":username,
            "password":password
            });
        return res.send(users);
    }

}else{
    return res.send('500',"le username est vide ou null veuillez renseigner le username");
}

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

        try {
       
        await  res.send(books);
        } catch (error) {
         await   res.send(error);
        }
      }
    
);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    try {  
        await res.send(JSON.stringify(books[isbn]));
        } catch (error) {
         await   res.send(error);
        }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    let filtered_books =Object.values(books).filter((book)=>book.author=== author);
    try {  
        await  res.send(JSON.stringify(filtered_books));;
        } catch (error) {
         await   res.send(error);
        }
   
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    let filtered_books =Object.values(books).filter((book)=>book.title=== title);
    try {  
        await   res.send(JSON.stringify(filtered_books));
        } catch (error) {
         await   res.send(error);
        }
   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
