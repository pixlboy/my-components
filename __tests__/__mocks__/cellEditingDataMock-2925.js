describe('mocks test', () => {
  it('mocking js', () => {
    expect(true).toBe(true);
  });
});


module.exports = {
    
  getMockedJnprDataTableObject : function(){
      return {
          dateList: JSON.parse('{"pageSize":5,"totalRecords":40,"ibaseList":[{"serialNumber":"JN11E3CEAAHA","productName":null,"materialItemCategory":"Premium Config Sys", "isIbParent": true,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-106072","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":"NORTHWESTEL INC - 0100276710","reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1302480000000,"warrantyStartDate":1302511298000,"warrantyExpirationDate":1334041200000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037537077","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":false,"primaryKey":{"propKey":"serialNo","propValue":"100011170123","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"100011170123","reverseTimeStamp":"9223372036854775807","targetVertexId":"100011170123|::|BP3AM1MI|::|10018762265|::|000000000037537077","identifier":null}},{"serialNumber":"","productName":null,"materialItemCategory":"Premium Config Sys", "isIbParent": true,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-100491","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":null,"reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1225324800000,"warrantyStartDate":1225357966000,"warrantyExpirationDate":1256799600000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037551248","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":true,"primaryKey":{"propKey":"serialNo","propValue":"6332001223","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"6332001223","reverseTimeStamp":"9223372036854775807","targetVertexId":"6332001223|::|BP3AM1MI|::|10018771808|::|000000000037551248","identifier":null}},{"serialNumber":"6332001226","productName":null,"materialItemCategory":"Configurable System","isIbParent": true,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-100491","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":"NORTHWESTEL INCORPORATED - 0100189169","reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1225324800000,"warrantyStartDate":1225353316000,"warrantyExpirationDate":1256799600000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037516576","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":true,"primaryKey":{"propKey":"serialNo","propValue":"6332001226","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"6332001226","reverseTimeStamp":"9223372036854775807","targetVertexId":"6332001226|::|BP3AM1MI|::|10018740922|::|000000000037516576","identifier":null}},{"serialNumber":"8623099122","productName":null,"materialItemCategory":"ADV","isIbParent": true,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-100914","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":null,"reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1238025600000,"warrantyStartDate":1238058417000,"warrantyExpirationDate":1269500400000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037547043","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":true,"primaryKey":{"propKey":"serialNo","propValue":"8623099122","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"8623099122","reverseTimeStamp":"9223372036854775807","targetVertexId":"8623099122|::|BP3AM1MS|::|10018767569|::|000000000037547043","identifier":null}},{"serialNumber":"8623099123","parentSerialNumber":null,"productName":null,"materialItemCategory":"BP3AM1MS","isIbParent": false,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-100914","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":null,"reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1238025600000,"warrantyStartDate":1238055961000,"warrantyExpirationDate":1269500400000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037532817","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":true,"primaryKey":{"propKey":"serialNo","propValue":"8623099123","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"8623099123","reverseTimeStamp":"9223372036854775807","targetVertexId":"8623099123|::|BP3AM1MS|::|10018757585|::|000000000037532817","identifier":null}},{"serialNumber":"8623099124","parentSerialNumber":"ABCDEF","productName":null,"materialItemCategory":"BP3AM1MS", "isIbParent": false,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-100914","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":null,"reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1238025600000,"warrantyStartDate":1238055961000,"warrantyExpirationDate":1269500400000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037532817","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":false,"primaryKey":{"propKey":"serialNo","propValue":"8623099123","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"8623099123","reverseTimeStamp":"9223372036854775807","targetVertexId":"8623099123|::|BP3AM1MS|::|10018757585|::|000000000037532817","identifier":null}},{"serialNumber":"8623099125","parentSerialNumber":"ABCDEF","productName":null,"materialItemCategory":"Fixed Software", "isIbParent": false,"assemblyNumber":null,"assemblyRev":null,"assemblyHardwareRev":null,"salesOrderNumber":"SOO-100914","salesOrderLineItem":null,"city":null,"state":null,"country":null,"address":null,"installedAt":null,"reseller":null,"distributor":null,"productRegistrationDate":1468338069086,"shipDate":1238025600000,"warrantyStartDate":1238055961000,"warrantyExpirationDate":1269500400000,"endOfLifeDate":null,"endOfServiceDate":null,"serviceDeclined":null,"contractID":null,"status":null,"contractStartDate":null,"contractEndDate":null,"supportCoverage":null,"coverageType":null,"description":null,"ibaseNumber":"000000000037532817","warrantyType":"Hardware Warranty","renewalContractExists":null,"hasChildComponents":false,"primaryKey":{"propKey":"serialNo","propValue":"8623099123","propValueNum":"0","srcVertexId":"-1182313304_771d13b7-152b-11e6-98a4-005056a95c7a","label":"ibase","direction":"-->","defaultIndexSequence":"8623099123","reverseTimeStamp":"9223372036854775807","targetVertexId":"8623099123|::|BP3AM1MS|::|10018757585|::|000000000037532817","identifier":null}}]}'),
          config:{
                  rowHeight: 29,
                  headerHeight: 38,
                  tableHeight: 348,
                  tableWidth: 800,
                  columnFilterable: false,
                  closeLeftPanelBtn: false,
                  showGlobalCheckbox: false,
                  defaultGlobal: false,
                  initialDelayForDatSubscribe: 500,
                  
                  globalAutoComplete: true,
                  mode:'R',
                  resizeMode: 'table', // table|column
                  showingInitialHiddenWhenFiltering: true, //we need to change hidden to show when filtering
                  showingInitialHiddenForSuperUser: false, //control if we want to show all columns for super user
                  caseManagerLink: 'https://cmstage.juniper.net/casemanager/#', //this is only for caseManagerLink
                  userRoles: ["Case Manager View Only"],
                  displayingActionButton: true,
                  displayingActionButtonOptionList: 'IBASES',
                  checkBoxEnabled: true,

                  defaultSortField: 'serialNumber',
                  defaultSortOrder: 'asc',
                  multipleConfigEnabled:true,
                  
                  columns: {
                    serialNumber: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'serialNumber',
                      type: 'text',
                      title: 'Serial #',
                      sortable: true,
                      filterable: true,
                      key: true,
                      sticky: true,
                      sendClickToParent: true,
                      clickToHighlight: true
                    },
                    productName: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'productName',
                      type: 'text',
                      title: 'Product Name',
                      sortable: true,
                      filterable: true,
                      hidden: false,
                      editable : true
                    },
                    materialItemCategory: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'materialItemCategory',
                      type: 'text',
                      title: 'Material Item Category',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    assemblyNumber: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'assemblyNumber',
                      type: 'text',
                      title: 'Assembly Number',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    assemblyRev: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'assemblyRev',
                      type: 'text',
                      title: 'Assembly Rev',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    assemblyHardwareRev: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'assemblyHardwareRev',
                      type: 'text',
                      title: 'Assembly Hardware Rev',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    salesOrderNumber: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'salesOrderNumber',
                      type: 'text',
                      title: 'Sales Order Number',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    salesOrderLineItem: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'salesOrderLineItem',
                      type: 'text',
                      title: 'Sales Order Line Item',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    city: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      type: 'text',
                      id: 'city',
                      title: 'City',
                      sortable: true,
                      filterable: true,
                      initialHidden: false
                    },
                    state: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      type: 'text',
                      id: 'state',
                      title: 'State',
                      sortable: true,
                      filterable: true,
                      initialHidden: false
                    },
                    country: {
                      defaultColumn: true,
                      width: 150,
                      flexGrows: 0,
                      type: 'text',
                      id: 'country',
                      title: 'Country',
                      sortable: true,
                      filterable: true,
                      initialHidden: false
                    },
                    address: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'address',
                      type: 'text',
                      title: 'Address',
                      sortable: false,
                      filterable: false,
                      hidden: false
                    },
                    installedAt: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'installedAt',
                      type: 'text',
                      title: 'Installed At',
                      sortable: true,
                      filterable: true,
                      editable: false,
                      hidden: false
                    },
                    reseller: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'reseller',
                      type: 'text',
                      title: 'Reseller',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    distributor: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'distributor',
                      type: 'text',
                      title: 'Distributor',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    productRegistrationDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'productRegistrationDate',
                      type: 'customDate',
                      title: 'Product Registration Date',
                      sortable: true,
                      filterable: true
                    },
                    shipDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'shipDate',
                      type: 'customDate',
                      title: 'Ship Date',
                      sortable: true,
                      filterable: true
                    },
                    warrantyType: {
                       defaultColumn: true,
                       width: 100,
                       flexGrows: 0,
                       id: 'warrantyType',
                       type: 'text',
                       title: 'Warranty Type',
                       sortable: true,
                       filterable: false,
                       hidden: false
                     },
                    warrantyStartDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'warrantyStartDate',
                      type: 'customDate',
                      title: 'Warranty Start Date',
                      sortable: true,
                      filterable: true
                    },
                    warrantyExpirationDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'warrantyExpirationDate',
                      type: 'customDate',
                      title: 'Warranty End Date',
                      sortable: true,
                      filterable: true
                    },
                    endOfLifeDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'endOfLifeDate',
                      type: 'customDate',
                      title: 'End Of Life Date',
                      sortable: true,
                      filterable: true
                    },
                    endOfServiceDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'endOfServiceDate',
                      type: 'customDate',
                      title: 'End Of Service Date',
                      sortable: true,
                      filterable: true
                    },
                    serviceDeclined: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 1,
                      type: 'multilist',
                      id: 'serviceDeclined',
                      title: 'Service Declined',
                      sortable: true,
                      filterable: true,
                      items: [{
                        id: 'yes',
                        title: 'Yes',
                        value: 'Yes'
                      }, {
                        id: 'no',
                        title: 'No',
                        value: 'No'
                      }]
                    },
                    contractID: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows:0 ,
                      id: 'contractID',
                      type: 'text',
                      title: 'Contract ID',
                      sortable: true,
                      filterable: false,
                      hidden: false
                    },
                    status: {
                      defaultColumn: true,
                      width: 100,

                      flexGrows: 1,
                      type: 'multilist',
                      id: 'status',
                      title: 'status',

                      sortable: true,
                      filterable: true,
                      items: [{
                        id: 'active',
                        title: 'Active',
                        value: 'Active'
                      }, {
                        id: 'expired',
                        title: 'Expired',
                        value: 'Expired'
                      }]
                    },
                    contractStartDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'contractStartDate',
                      type: 'customDate',
                      title: 'Contract Start Date',
                      sortable: true,
                      filterable: true
                    },
                    contractEndDate: {
                      defaultColumn: true,
                      width: 200,
                      flexGrows: 0,
                      id: 'contractEndDate',
                      type: 'customDate',
                      title: 'Contract End Date',
                      sortable: true,
                      filterable: true
                    },
                    supportCoverage: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      type: 'text',
                      id: 'supportCoverage',
                      title: 'Support Coverage',
                      sortable: true,
                      filterable: true
                    },
                    coverageType: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      id: 'coverageType',
                      type: 'text',
                      title: 'Coverage Type',
                      sortable: true,
                      filterable: true,
                      hidden: false
                    },
                    description: {
                      defaultColumn: true,
                      width: 100,
                      flexGrows: 0,
                      type: 'text',
                      id: 'description',
                      title: 'Description',
                      sortable: true,
                      filterable: true
                    },
                    renewalContractExists: {
                       defaultColumn: true,
                       width: 250,
                       flexGrows: 0,
                       type: 'text',
                       id: 'renewalContractExists',
                       title: 'Renewal Contract Exists',
                       sortable: true,
                       filterable: true
                     },
                    ibaseNumber: {
                      defaultColumn: false,
                      width: 100,
                      flexGrows: 1,
                      type: 'text',
                      id: 'ibaseNumber',
                      title: 'ibase Number',
                      sortable: true,
                      filterable: false,
                      hidden: true
                    }
                  }
                }
      }
    }


};
