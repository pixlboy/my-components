var Feature = require( "./Feature" );

var features = require( './configurations/features.json' );
var features_test = require( './configurations/features-test.json' );
var features_development = require( './configurations/features-development.json' );
var features_kubdev = require( './configurations/features-kubdev.json' );
var features_kubtesting = require( './configurations/features-kubtesting.json' );
var features_kubstaging = require( './configurations/features-kubstaging.json' );
var features_kubproduction = require( './configurations/features-kubproduction.json' );

class FeatureTogglerService {

    //constructor contains two parameters, environment , userId, both are optional
    //env: development|kubdev|kubtesting|kubstaging|kubproduction
    //userId: user-emails
    constructor( environment, userId ) {
        this['environment'] = environment;
        this['userId'] = userId;
        this._preFetchAllFeatures();
    }

    isFeatureEnabled( feature ) {
        return this.getAvailableFeatures().includes(feature);
    }

    getAvailableFeatures() {

        var featureList = this._getEnvFeatures( "base" );
        if ( this.environment ) {
            //we now have environment specified, so we need to check env specific features
            this._getEnvFeatures( this.environment ).forEach( feature => {
                var exist = false;
                for ( var i = 0; i < featureList.length; i++ ) {
                    if ( feature.name === featureList[i].name ) {
                        exist = true;
                        featureList[i].enabled = feature.enabled;
                        featureList[i].visibleUsers = feature.visibleUsers;
                    }
                }
                if ( !exist )
                    featureList.push( feature );
            });
        }

        //we now merged two features, now, we need to filter based on userId / enable settings
        var finalResults = [];
        var _this = this;
        featureList.forEach( function( feature ) {
            var toAdd = false;
            if ( 'visibleUsers' in feature ) {
                if ( feature.visibleUsers.length == 0 ) {
                    toAdd = true;
                } else {
                    if ( _this['userId'] )
                        feature.visibleUsers.forEach( function( user ) {
                            if ( user.toLowerCase() === _this['userId'].toLowerCase() ) {
                                toAdd = true;
                            }
                        });
                    else
                        toAdd = true;
                }
            } else {
                //just add it
                toAdd = true;
            }

            if ( toAdd && feature.enabled === true )
                finalResults.push( feature.name );

        });
        return finalResults;
    }

    _getEnvFeatures( env ) {
        if ( env in this._features )
            return this._features[env];
        else
            return [];
    }

    _preFetchAllFeatures() {
        this._features = [];
        this._features['base'] = this._parseFeatures( features );
        this._features['development'] = this._parseFeatures( features_development );
        this._features['kubdev'] = this._parseFeatures( features_kubdev );
        this._features['kubtesting'] = this._parseFeatures( features_kubtesting );
        this._features['kubstaging'] = this._parseFeatures( features_kubstaging );
        this._features['kubproduction'] = this._parseFeatures( features_kubproduction );
        this._features['test'] = this._parseFeatures( features_test );
    }

    _parseFeatures( jsonObjs ) {
        var features = [];
        jsonObjs.forEach( featureObj => {
            features.push( new Feature( featureObj ) );
        });
        return features;
    }

}
module.exports = FeatureTogglerService;