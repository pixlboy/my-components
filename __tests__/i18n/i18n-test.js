'use strict';

jest.unmock('../../public/src/components/i18n/i18n');

describe('I18N library test', ()=>{

    var i18n = require('../../public/src/components/i18n/i18n').get();
    var transMock = require('../__mocks__/transMock');

    it('default language translate', ()=>{
        expect( i18n.trans('Login') ).toBe('Login');
        expect( i18n.trans('Hello') ).toBe('Hello');
        expect( i18n.trans('Login','home') ).toBe('Login');
        expect( i18n.trans('Hello', 'home') ).toBe('Hello');
    });

    it('gettign default locale, en-US', ()=>{
        expect(i18n.locale).toBe('en-US');
        i18n.locale='en-GB';
        expect(i18n.locale).toBe('en-GB');
    });

    it('gettign default locale with lower case, en-US', ()=>{
        i18n.locale='en-US';
        expect(i18n.getLocaleLowerCase()).toBe('en-us');
        i18n.locale='en-GB';
        expect(i18n.getLocaleLowerCase()).toBe('en-gb');
    });

    it('assign data for locale', ()=>{
        var deData =  transMock.getTransData('de-DE');
        i18n.setDictFor('de-DE', deData);
        expect( i18n.trans('Login', 'home') ).toBe('Einloggen');
        expect( i18n.trans('Hello','home') ).toBe('Hallo');

        i18n.setDictFor('fr-FR', transMock.getTransData('fr-FR'));
        expect( i18n.trans('Login','home') ).toBe("s'identifier");
        expect( i18n.trans('Hello', 'home') ).toBe('Bonjour');
    });


    it('Not assigning pageId, just message and get translated', ()=>{
        var deData =  transMock.getTransData('de-DE');
        i18n.setDictFor('de-DE', deData);
        expect( i18n.trans('msg1') ).toBe('msg1_de');
        expect( i18n.trans('msg2') ).toBe('msg2_de');
        expect( i18n.trans('Hello123 %1, %2', '','Frank', 'He') ).toBe('Einloggen123 Frank, He');

        i18n.setDictFor('fr-FR', transMock.getTransData('fr-FR'));
        expect( i18n.trans('msg3') ).toBe('msg3_fr');
        expect( i18n.trans('msg4') ).toBe('msg4_fr');
    });

    it('translate with parameters', ()=>{
        var deData =  transMock.getTransData('de-DE');
        i18n.setDictFor('de-DE', deData);
        expect( i18n.trans('Hello %1, %2', 'pageId', 'Frank', 'He') ).toBe('Einloggen Frank, He');

        i18n.setDictFor('fr-FR', transMock.getTransData('fr-FR'));
        expect( i18n.trans('Hello %1, %2', 'pageId', 'Frank', 'He') ).toBe('Bonjour Frank He');

    });

    it('translate errors', ()=>{
        var deData =  transMock.getTransData('de-DE');
        i18n.setDictFor('de-DE', deData);
        expect( i18n.transError(300)).toBe('300 error - de');
        expect( i18n.transError(301)).toBe('301 error - de');

        i18n.setDictFor('fr-FR', transMock.getTransData('fr-FR'));
        expect( i18n.transError(300)).toBe('300 error - fr');
        expect( i18n.transError(301)).toBe('301 error - fr');
    });
});
