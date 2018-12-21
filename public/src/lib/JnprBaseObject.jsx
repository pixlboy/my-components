var JnprBaseObject = {
     
     objectToWatch: null,
     subscribers: [],
     
     subscribe: function(subscriber){
       this.subscribers.push(subscriber);
     },
     
     setObject: function(obj){
       this.objectToWatch = obj;
       (function(self){
         self.subscribers.forEach(function(cb){
             cb(self.getObject());
           });
       })(this);
     },
     getObject: function(){
       return this.objectToWatch;
     }
};

module.exports = JnprBaseObject;