describe('mocks test', () => {
  it('mocking js', () => {
    expect(true).toBe(true);
  });
});


export default function timer(seconds) {
  return new Promise((resolve, reject) => {
     setTimeout(()=>{
       resolve()
     }, seconds*1000);
  });
}