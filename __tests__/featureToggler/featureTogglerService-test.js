'use strict';

jest.unmock('../../public/src/feature-toggler/FeatureTogglerService');

describe('Testing Feature Toggler', ()=>{
  
  let FeatureTogglerService = require('../../public/src/feature-toggler/FeatureTogglerService');
  
  it('should rerieve data from test features json', ()=>{
    var fs = new FeatureTogglerService();
    var features = fs._getEnvFeatures('test');
    expect(features.length).toBe(4);
    expect(features[0].enabled).toBe(true);
    expect(features[0].name).toBe('FEATURE-CASEMANAGER');
    expect(features[0].visibleUsers.length).toBe(2);
    expect(features[0].visibleUsers[0]).toBe('frankhe@juniper.net');
    expect(features[0].visibleUsers[1]).toBe('ngcsc1@ngcsc.33mail.com');

    expect(features[1].enabled).toBe(false);
    expect(features[1].name).toBe('FEATURE-CONTRACTRENEWAL');
    expect(features[1].visibleUsers.length).toBe(2);
  });
  
  it('should rerieve no features for none-existed json file', ()=>{
    var fs = new FeatureTogglerService();
    var features = fs._getEnvFeatures('test-fake');
    expect(features.length).toBe(0);
  });
  
  
  it('should have one feature for logged in user - userId valid', ()=>{
    var fs = new FeatureTogglerService('test','frankhe@juniper.net');
    expect(fs.getAvailableFeatures().length).toBe(2);
    
    expect(fs.isFeatureEnabled('FEATURE-CASEMANAGER')).toBe(true);
    expect(fs.isFeatureEnabled('FEATURE-CONTRACTRENEWAL12')).toBe(true);
    expect(fs.isFeatureEnabled('FEATURE-CONTRACTRENEWAL')).toBe(false);
    
  });
  
  it('should have one feature for logged in user - Invalid UserId', ()=>{
    var fs = new FeatureTogglerService('test','frankhe123@juniper.net');
    expect(fs.getAvailableFeatures().length).toBe(1);
    
    expect(fs.isFeatureEnabled('FEATURE-CONTRACTRENEWAL12')).toBe(true);
    expect(fs.isFeatureEnabled('FEATURE-CONTRACTRENEWA')).toBe(false);
    expect(fs.isFeatureEnabled('FEATURE-CONTRAasfdf')).toBe(false);
    
  });
  
  it('should have no featuer', ()=>{
    var fs = new FeatureTogglerService();
    expect(fs.getAvailableFeatures().length).toBe(0);
  });
  
  
});