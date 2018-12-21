describe('mocks test', () => {
  it('mocking js', () => {
    expect(true).toBe(true);
  });
});

module.exports = {
    getTransData: function(locale){

        if(locale==='de-DE'){
            return {
                "pageId":{
                    "key":"Germany Key Trans",
                    "Hello %1, %2": "Einloggen %1, %2"
                },
                "home":{
                    "Login": "Einloggen",
                    "Hello": "Hallo",
                    "Hi": "Hi"
                },
                "":{
                    'msg1': 'msg1_de',
                    'msg2': 'msg2_de',
                    "Hello123 %1, %2": "Einloggen123 %1, %2"
                },
                "errors":{
                    300: "300 error - de",
                    301: "301 error - de",
                    401: "401 error - de",
                    501: "501 error - de",
                }
            }
        }

        if(locale=='fr-FR'){
            return {
                "pageId":{
                    "key":"French Key Trans",
                    "Hello %1, %2": "Bonjour %1 %2"
                },
                "home":{
                    "Login": "s'identifier",
                    "Hello": "Bonjour",
                    "Hi": "Bonjour"
                },
                "":{
                    'msg3': 'msg3_fr',
                    'msg4': 'msg4_fr'
                },
                "errors":{
                    300: "300 error - fr",
                    301: "301 error - fr",
                    401: "401 error - fr",
                    501: "501 error - fr",
                }
            }
        }
    }
}
