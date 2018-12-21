jest.unmock('../../public/src/components/data_table/comps/ExpandableActionsCell');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ExpandableActionsCellComp from '../../public/src/components/data_table/comps/ExpandableActionsCell';

var $ = require('jquery')

describe('<ExpandableActionsCellComp />', ()=>{
  it('Renders all the Icons in the cell', ()=>{
    const renderer = TestUtils.createRenderer(); // shallow render
    
    var items = [
                 {
                   icon: 'mode_edit',
                   type: 'edit'
                 },
                 {
                   icon:'content_copy',
                   type:'copy'
                 },
                 {
                   icon:'./images/copy.png',
                   type:'copy-1'
                 }
                 ];
    
    var values = {
        edit: true,
        copy:true,
        'copy-1':true
    }
    
    var cellComp = TestUtils.renderIntoDocument(<ExpandableActionsCellComp
        items={items} value={values}
        />);
    expect(TestUtils.isCompositeComponent(cellComp)).toBeTruthy();
    
    var icons = TestUtils.scryRenderedDOMComponentsWithTag(cellComp, 'i');
    expect(icons.length).toBe(2);
    
    var images = TestUtils.scryRenderedDOMComponentsWithTag(cellComp, 'img');
    expect(images.length).toBe(1);
    
  });
    
    it('Renders some the Icons in the cell', ()=>{
      const renderer = TestUtils.createRenderer(); // shallow render
      
      var items = [
                   {
                     icon: 'mode_edit',
                     type: 'edit'
                   },
                   {
                     icon:'content_copy',
                     type:'copy'
                   },
                   {
                     icon:'./images/copy.png',
                     type:'copy-1'
                   }
                   ];
      
      var values = {
          edit: false,
          copy:true,
          'copy-1':false
      }
      
      var cellComp = TestUtils.renderIntoDocument(<ExpandableActionsCellComp
          items={items} value={values}
          />);
      expect(TestUtils.isCompositeComponent(cellComp)).toBeTruthy();
      
      var icons = TestUtils.scryRenderedDOMComponentsWithTag(cellComp, 'i');
      expect(icons.length).toBe(1);
      
      var images = TestUtils.scryRenderedDOMComponentsWithTag(cellComp, 'img');
      expect(images.length).toBe(0);
      
    });
      
      it('Not rendering action buttons', ()=>{
        const renderer = TestUtils.createRenderer(); // shallow render
        
        var items = [
                     {
                       icon: 'mode_edit',
                       type: 'edit'
                     },
                     {
                       icon:'content_copy',
                       type:'copy'
                     },
                     {
                       icon:'./images/copy.png',
                       type:'copy-1'
                     }
                     ];
        
        var values = {
            edit: false,
            copy:false,
            'copy-1':false
        }
        
        var cellComp = TestUtils.renderIntoDocument(<ExpandableActionsCellComp
            items={items} value={values}
            />);
        expect(TestUtils.isCompositeComponent(cellComp)).toBeTruthy();
        
        var icons = TestUtils.scryRenderedDOMComponentsWithTag(cellComp, 'i');
        expect(icons.length).toBe(0);
        
        var images = TestUtils.scryRenderedDOMComponentsWithTag(cellComp, 'img');
        expect(images.length).toBe(0);
        
      });


});
