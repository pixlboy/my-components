describe('mocks test', () => {
  it('mocking js', () => {
    expect(true).toBe(true);
  });
});


module.exports = {

  getMockedCHDataTableObject : function(){
      return {
          dateList: JSON.parse('{"pageSize":50,"totalRecords":2,"contractsList":[{"contractId":"0060482629","startDate":1320828049000,"endDate":1511426449000,"status":"Active","locationName":"SYNAPSE NETWORKS","locationAccId":"0100130816","primaryKey":{"propKey":"contEndDt","propValue":null,"propValueNum":"1320828049000","srcVertexId":"-191444005_6092b263-a990-11e6-ae05-005056a97723","label":"scLI","direction":"-->","defaultIndexSequence":null,"reverseTimeStamp":"9223370525428326807","targetVertexId":"00604826290000000020"},"hasLineItems":true,"city":"CHICAGO","serialNo":"NGMY14006","state":"Illinois","country":"United States","supportCoverage":"SVC-ND-MAG4610-L","product":"SCBE-MX-BB","shipDate":1540882800000,"warrantyExpDate":0,"softwareSupportReferenceNumber":null},{"contractId":"0060482630","startDate":1477987085000,"endDate":1606467485000,"status":"Active","locationName":"SYNAPSE NETWORKS","locationAccId":"0100130816","primaryKey":{"propKey":"contEndDt","propValue":null,"propValueNum":"1477987085000","srcVertexId":"-191444005_6092b263-a990-11e6-ae05-005056a97723","label":"scLI","direction":"-->","defaultIndexSequence":null,"reverseTimeStamp":"9223370430387290807","targetVertexId":"00604826300000000010"},"hasLineItems":true,"city":"CHICAGO","serialNo":"NGMY14006","state":"Illinois","country":"United States","supportCoverage":"SVC-ND-MAG4610-L","product":"SCBE-MX-BB","shipDate":1540882800000,"warrantyExpDate":0,"softwareSupportReferenceNumber":null}],"responseList":[{"contractId":"0060482629","startDate":1320828049000,"endDate":1511426449000,"status":"Active","locationName":"SYNAPSE NETWORKS","locationAccId":"0100130816","primaryKey":{"propKey":"contEndDt","propValue":null,"propValueNum":"1320828049000","srcVertexId":"-191444005_6092b263-a990-11e6-ae05-005056a97723","label":"scLI","direction":"-->","defaultIndexSequence":null,"reverseTimeStamp":"9223370525428326807","targetVertexId":"00604826290000000020"},"hasLineItems":true,"city":"CHICAGO","serialNo":"NGMY14006","state":"Illinois","country":"United States","supportCoverage":"SVC-ND-MAG4610-L","product":"SCBE-MX-BB","shipDate":1540882800000,"warrantyExpDate":0,"softwareSupportReferenceNumber":null},{"contractId":"0060482630","startDate":1477987085000,"endDate":1606467485000,"status":"Active","locationName":"SYNAPSE NETWORKS","locationAccId":"0100130816","primaryKey":{"propKey":"contEndDt","propValue":null,"propValueNum":"1477987085000","srcVertexId":"-191444005_6092b263-a990-11e6-ae05-005056a97723","label":"scLI","direction":"-->","defaultIndexSequence":null,"reverseTimeStamp":"9223370430387290807","targetVertexId":"00604826300000000010"},"hasLineItems":true,"city":"CHICAGO","serialNo":"NGMY14006","state":"Illinois","country":"United States","supportCoverage":"SVC-ND-MAG4610-L","product":"SCBE-MX-BB","shipDate":1540882800000,"warrantyExpDate":0,"softwareSupportReferenceNumber":null}]}'),
          config: {
            initalNumberPerPage: 4,
            rowHeight: 29,
            headerHeight: 38,
            tableHeight: 348,
            tableWidth: 800,
            hidingBottomIndicator: true,
            enableInAppDownload: true,
            columns: {
              contractId: {
                defaultColumn: true,
                width: 130,
                minWidth: 100,
                flexGrows: 0,
                id: 'contractId',
                type: 'text',
                title: 'Contract ID',
                key: true,
                sticky: true,
                //  sendClickToParent: true,
              },
              contractType: {
                defaultColumn: true,
                width: 120,
                flexGrows: 0,
                id: 'contractType',
                type: 'text',
                title: 'Contract Type'
              },
              status: {
                defaultColumn: true,
                width: 100,
                flexGrows: 1,
                type: 'multilist',
                id: 'status',
                title: 'status',
                items: [
                  {
                    id: 'active',
                    title: 'Active',
                    value: 'Active'
                  }, {
                    id: 'expired',
                    title: 'Expired',
                    value: 'Expired'
                  }
                ]
              },
              startDate: {
                defaultColumn: true,
                width: 120,
                flexGrows: 0,
                id: 'startDate',
                type: 'customDate',
                title: 'Start Date'
              },
              endDate: {
                defaultColumn: true,
                width: 120,
                flexGrows: 0,
                id: 'endDate',
                type: 'customDate',
                title: 'End Date'
              },
              supportCoverage: {
                defaultColumn: true,
                width: 160,
                flexGrows: 0,
                type: 'text',
                id: 'supportCoverage',
                title: 'Support Coverage'
              },
              coverageType: {
                defaultColumn: true,
                width: 100,
                flexGrows: 0,
                id: 'coverageType',
                type: 'text',
                title: 'Coverage Type'
              },
              description: {
                defaultColumn: true,
                width: 100,
                flexGrows: 0,
                type: 'text',
                id: 'description',
                title: 'Description'
              }
            }

          },
          serialNumberCellData:JSON.parse('{"key":true,"value":"JN11E3CEAAHA","disableLink":false,"ibParents":true,"link":"0000000001","children":{"contractsHistory":{"children":[{"contractId":"0060482629","startDate":1320828049000,"endDate":1511426449000,"status":"Active","locationName":"SYNAPSE NETWORKS","locationAccId":"0100130816","primaryKey":{"propKey":"contEndDt","propValue":null,"propValueNum":"1320828049000","srcVertexId":"-191444005_6092b263-a990-11e6-ae05-005056a97723","label":"scLI","direction":"-->","defaultIndexSequence":null,"reverseTimeStamp":"9223370525428326807","targetVertexId":"00604826290000000020"},"hasLineItems":true,"city":"CHICAGO","serialNo":"NGMY14006","state":"Illinois","country":"United States","supportCoverage":"SVC-ND-MAG4610-L","product":"SCBE-MX-BB","shipDate":1540882800000,"warrantyExpDate":0,"softwareSupportReferenceNumber":null},{"contractId":"0060482630","startDate":1477987085000,"endDate":1606467485000,"status":"Active","locationName":"SYNAPSE NETWORKS","locationAccId":"0100130816","primaryKey":{"propKey":"contEndDt","propValue":null,"propValueNum":"1477987085000","srcVertexId":"-191444005_6092b263-a990-11e6-ae05-005056a97723","label":"scLI","direction":"-->","defaultIndexSequence":null,"reverseTimeStamp":"9223370430387290807","targetVertexId":"00604826300000000010"},"hasLineItems":true,"city":"CHICAGO","serialNo":"NGMY14006","state":"Illinois","country":"United States","supportCoverage":"SVC-ND-MAG4610-L","product":"SCBE-MX-BB","shipDate":1540882800000,"warrantyExpDate":0,"softwareSupportReferenceNumber":null}],"config":{"title":"Contracts History","displayingTitle":true}}},"totalChildren":0}')
      }
    }


};
