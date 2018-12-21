const ValidateService = {
  //HH:mm:ss
  validateTime: function(time){
    var valid = true;
    var timeParts = time.split(':');
    if(timeParts.length!==3){
      valid=false
    }else{
      var hour = timeParts[0];
      var min = timeParts[1];
      var second = timeParts[2];
      if(isNaN(hour) || isNaN(min) || isNaN(second)){
        valid=false;
      }else{
        if(parseInt(hour)<0 || parseInt(hour)>=24 ){
          valid = false;
        }else if(parseInt(min)<0 || parseInt(min)>=60){
          valid = false;
        }else if(parseInt(second)<0 || parseInt(second)>=60){
          valid = false;
        }
      }
    }

    return valid;
  }
}
module.exports = ValidateService;
