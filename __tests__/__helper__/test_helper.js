describe('mock helper test', () => {
  it('mocking helper js', () => {
    expect(true).toBe(true);
  });
});

module.exports = {
    
    getStyleClassesFromClassList:function(classList){
      var classes = [];
      Object.keys(classList).map(key=>{
        classes.push(classList[key]);
      });
      return classes;
    }
    
};