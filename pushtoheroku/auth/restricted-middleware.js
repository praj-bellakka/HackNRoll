module.exports = (req, res, next) => {
    if(req.session && req.session.user){ //if req.session.user exists, they can view the restricted pages
        next(); //continue to router 
    }else {
        res.status(401).json({message: "Not logged in!"});
    }  
};