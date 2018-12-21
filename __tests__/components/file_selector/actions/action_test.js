import {
    fileSelected,
    removeFile,
    startProcessing,
    finishedProcessing
} from '../../../../components/file_selector/actions';

describe('FileSelector - Actions', () => {
    it('fileSelected()', () => {
        var results = fileSelected('file', {demo:'test'});
        expect(results.type).toBe('FILE_SELECTED');
        expect(results.file).toBe('file');
        expect(results.restrictions.demo).toBe('test');
    });
    it('removeFile()', () => {
        var results = removeFile();
        expect(results.type).toBe('FILE_REMOVE');
    });
    it('startProcessing()', () => {
        var results = startProcessing();
        expect(results.type).toBe('START_PROCESSING');
    });
    it('finishedProcessing()', () => {
        var results = finishedProcessing();
        expect(results.type).toBe('FINISHED_PROCESSING');
    });
});
