'use strict';

jest.unmock('../../public/src/components/navigator/NavigatorComp');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import NavigatorComp from '../../public/src/components/navigator/NavigatorComp';
import test_helper from '../__helper__/test_helper';

describe('Test Navigator Component', ()=>{


    let options = [
    	{
    		title: "step1",
    		active: true
    	},
    	{
    		title: "step2",
    		active: false
    	},
    	{
    		title: "step3",
    		active: false
    	},
    	{
    		title: "step4",
    		active: false
    	},
    	{
    		title: "step5",
    		active: false
    	}
    ];

    it('generate the navigator', ()=>{
        var navigatorComp = TestUtils.renderIntoDocument(
            <NavigatorComp options= {options}/>);
        expect(TestUtils.isCompositeComponent(navigatorComp)).toBeTruthy();

        var navBody = TestUtils.findRenderedDOMComponentWithClass(navigatorComp, 'navContentHolder');
        expect(navBody.children.length).toBe(5);

        expect( test_helper.getStyleClassesFromClassList(navBody.children[0].children[0].classList).indexOf('navItemCircleActive')>=0).toBe(true);
        expect( test_helper.getStyleClassesFromClassList(navBody.children[1].children[0].classList).indexOf('navItemCircleActive')>=0).toBe(false);
        expect( test_helper.getStyleClassesFromClassList(navBody.children[2].children[0].classList).indexOf('navItemCircleActive')>=0).toBe(false);
        expect( test_helper.getStyleClassesFromClassList(navBody.children[3].children[0].classList).indexOf('navItemCircleActive')>=0).toBe(false);
    });

});
