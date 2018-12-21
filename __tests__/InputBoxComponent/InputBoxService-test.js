jest.unmock("../../public/src/components/input_box/InputBoxService");

import InputBoxService from '../../public/src/components/input_box/InputBoxService';

describe('InputBox Service', ()=>{
  
  it('should generate blocks - initial', ()=>{
      
    var service = new InputBoxService();
    service.setInput("test1,test2;test3 test4");
    expect(service.getBlocks(true).length).toBe(4);
    expect(service.getBlocks(true)[0]).toBe('test1');
    expect(service.getBlocks(true)[1]).toBe('test2');
    expect(service.getBlocks(true)[2]).toBe('test3');
    expect(service.getBlocks(true)[3]).toBe('test4');
    
  });
  
  it('should generate blocks - user typing', ()=>{
    
    var service = new InputBoxService();
    service.setInput("test1,test2;test3");
    expect(service.getBlocks(false).length).toBe(3);
    expect(service.getBlocks(false)[0]).toBe('test1');
    expect(service.getBlocks(false)[1]).toBe('test2');
    expect(service.getBlocks(false)[2]).toBe('test3');
    expect(service.getRemainingStr()).toBe('');
    
    service.setInput("test1,test2;test3 test4");
    expect(service.getBlocks(false).length).toBe(4);
    expect(service.getBlocks(false)[0]).toBe('test1');
    expect(service.getBlocks(false)[1]).toBe('test2');
    expect(service.getBlocks(false)[2]).toBe('test3');
    expect(service.getBlocks(false)[3]).toBe('test4');
    expect(service.getRemainingStr()).toBe('');
    
    expect(service.getOriginalInput()).toBe('test1,test2;test3 test4');
    expect(service.getFormattedInput()).toBe('test1,test2,test3,test4');
    
  });
  
  it('should delete one block/blocks', ()=>{
    
    var service = new InputBoxService();
    
    service.setInput("test1,test2;test3 test4");
    expect(service.getBlocks(false).length).toBe(4);
    expect(service.getBlocks(false)[0]).toBe('test1');
    expect(service.getBlocks(false)[1]).toBe('test2');
    expect(service.getBlocks(false)[2]).toBe('test3');
    expect(service.getBlocks(false)[3]).toBe('test4');
    expect(service.getRemainingStr()).toBe('');
    
    //delete one block
    service.deleteBlock('test3');
    var blocks = service.getBlocks(false);
    expect(blocks.length).toBe(3);
    expect(blocks[0]).toBe('test1');
    expect(blocks[1]).toBe('test2');
    expect(blocks[2]).toBe('test4');
    expect(service.getFormattedInput()).toBe('test1,test2,test4');
    
    
  });
  
});