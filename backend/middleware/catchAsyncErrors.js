module.exports = (Func) => (req,res,next) => {
    Promise.resolve(Func(req,res,next)).catch(next);  //pass controller to the next middleware in the sequence if error occurs
}