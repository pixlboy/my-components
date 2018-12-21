jest.unmock('../../public/src/components/data_table/comps/DetailPopupView');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import DetailPopUpView from '../../public/src/components/data_table/comps/DetailPopupView';
import  DataTableObjectFactory from "../../public/src/components/data_table/data_object/DataTableObjectFactory";
import ibaseDataMock from '../__mocks__/ibaseDataMock';

var jnprDataTableObj = DataTableObjectFactory.getDataTableObject();


describe('<DetailPopUpView />', () => {

  it('should show custom content with simple text', ()=>{

    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    tableConfig['customizedPopUp'] = true
    jnprDataTableObj.setConfig(tableConfig, "table");

    var detailedPopUpView = TestUtils.renderIntoDocument(<DetailPopUpView  appId="table" extraData='helloWorld' />);
    expect(TestUtils.isCompositeComponent(detailedPopUpView)).toBeTruthy();

    var parentWrapper = TestUtils.findRenderedDOMComponentWithClass(detailedPopUpView, 'attachingPointUl');
    expect(parentWrapper.children.length).toBe(3)
    expect(parentWrapper.children[2].innerHTML).toBe('helloWorld');

  });

  it('should show custom content with html content', ()=>{

    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    tableConfig['customizedPopUp'] = true
    jnprDataTableObj.setConfig(tableConfig, "table");

    var detailedPopUpView = TestUtils.renderIntoDocument(<DetailPopUpView  appId="table" extraData='<h1 style="color:red">helloWorld</h1>' />);
    expect(TestUtils.isCompositeComponent(detailedPopUpView)).toBeTruthy();

    var parentWrapper = TestUtils.findRenderedDOMComponentWithClass(detailedPopUpView, 'attachingPointUl');
    expect(parentWrapper.children.length).toBe(3)
    expect(parentWrapper.children[2].innerHTML).toBe('<h1 style="color:red">helloWorld</h1>');

  });

    
});
