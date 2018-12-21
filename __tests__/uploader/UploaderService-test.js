'use strict';

jest.unmock('../../public/src/components/uploader/UploaderService');
describe('UploaderService', ()=>{

  let uploaderService = require('../../public/src/components/uploader/UploaderService');

  it('generateSingleBaseFileName()', ()=>{
    var testingResults = uploaderService.generateSingleBaseFileName('file1(1).txt');
    expect( testingResults[0] ).toBe('file1.txt');
    expect( testingResults[1] ).toBe(1);

    testingResults = uploaderService.generateSingleBaseFileName('filexyz(125).mgd');
    expect( testingResults[0] ).toBe('filexyz.mgd');
    expect( testingResults[1] ).toBe(125);

    testingResults = uploaderService.generateSingleBaseFileName('filexyz.mgd');
    expect( testingResults[0] ).toBe('filexyz.mgd');
    expect( testingResults[1] ).toBe(0);

    testingResults = uploaderService.generateSingleBaseFileName('file(abc)xyz.mgd');
    expect( testingResults[0] ).toBe('file(abc)xyz.mgd');
    expect( testingResults[1] ).toBe(0);
    testingResults = uploaderService.generateSingleBaseFileName('filexyz(good).mgd');
    expect( testingResults[0] ).toBe('filexyz(good).mgd');
    expect( testingResults[1] ).toBe(0);

  });

  it('generateBaseFileNameFromList()', ()=>{
    var fileNameList = ['file1(1).txt','file1(2).txt','file1(3).txt'];
    var testingResults = uploaderService.generateBaseFileNameFromList('file1(1).txt', fileNameList);
    expect( testingResults[0] ).toBe('file1.txt');
    expect( testingResults[1] ).toBe(4);


    fileNameList = ['file1(1).txt','file1(2).txt','file1(3).txt'];
    testingResults = uploaderService.generateBaseFileNameFromList('filex.txt', fileNameList);
    expect( testingResults[0] ).toBe('filex.txt');
    expect( testingResults[1] ).toBe(0);

  });

  it('generateUploadFileName()', ()=>{
    var fileNameList = ['file1(1).txt','file1(2).txt','file1(3).txt'];
    expect(uploaderService.generateUploadFileName('file1.txt', fileNameList)).toBe('file1(4).txt');
    expect(uploaderService.generateUploadFileName('filex.txt', fileNameList)).toBe('filex.txt');

    fileNameList = ['file1.txt','file2.txt','filasff.txt'];
    expect(uploaderService.generateUploadFileName('filex.txt', fileNameList)).toBe('filex.txt');

    fileNameList = [];
    expect(uploaderService.generateUploadFileName('filex.txt', fileNameList)).toBe('filex.txt');


    fileNameList =  ['file.txt','file.txt','filasff.txt'];
    expect(uploaderService.generateUploadFileName('file.txt', fileNameList)).toBe('file(1).txt');

  });

});
