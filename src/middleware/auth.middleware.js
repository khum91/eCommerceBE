

const checkLogin = (req, res, next) => {

    //For Error Handling
   // next({status:401, message:'Please login first'});
    next();
}
export default checkLogin;