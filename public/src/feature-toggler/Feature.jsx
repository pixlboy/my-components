/**
 * Feature Object Class, contains name, enabled, visibleUsers
 */
class Feature{
    constructor(featureObj){
        this['name'] = 'name' in featureObj?featureObj.name:"";
        this['enabled'] = 'enabled' in featureObj?featureObj.enabled==='true':true;
        this['visibleUsers'] = 'visibleUsers' in featureObj?featureObj.visibleUsers: [];
    }
}
module.exports = Feature;