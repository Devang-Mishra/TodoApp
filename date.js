
module.exports.getdate=function() {
   
    var options ={
    weekday: 'long',
    day : 'numeric',
    month : 'long'
    };

    var today=new Date();
    return today.toLocaleDateString("en-US",options);
}

module.exports.getday=function() {
   
    var options ={
    weekday: 'long'
    };

    var today=new Date();
    return today.toLocaleDateString("en-US",options);
}