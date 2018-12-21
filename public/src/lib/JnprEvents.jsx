
var JnprEvents = {
     
     HEADER_FILTER_RESET: "HEADER_FILTER_RESET",	
     	
     subscribers: {},
     
     trigger: function(eventId, appId){
	 
	 if(appId)
	     eventId+=appId;
	 
	 if(!this.subscribers[eventId])
	     return;
	 this.subscribers[eventId].map(function(item){
	     item.callback();
	 });
     },
     
     subscribe: function(eventId, subscriberId, appId, cb){
	 if(appId)
	     eventId+=appId;
	 if(!this.subscribers[eventId])
	     this.subscribers[eventId]=[];
	 var exist = false;
	 this.subscribers[eventId].map(function(item){
	     if(item.subscriberId===subscriberId){
		 exist = true;
		 item.callback = cb;
	     }
	 });
	 if(!exist)
	     this.subscribers[eventId].push({
		 subscriberId: subscriberId,
		 callback: cb
	     });
     },
     
     unSubscribe: function(eventId, appId, subscriberId){
	 if(appId)
	     eventId+=appId;
	 if(!this.subscribers[eventId])
	     return;
	 for(var i=0; i<this.subscribers[eventId].length; i++){
	     if( this.subscribers[eventId][i].subscriberId===subscriberId){
		 this.subscribers[eventId].splice(i); 
		 break;
	     } 
	 }
     }
	
};

module.exports = JnprEvents;