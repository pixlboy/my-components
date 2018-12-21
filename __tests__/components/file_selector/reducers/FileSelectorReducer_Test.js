import FileSelectorReducer from '../../../../components/file_selector/reducers/FileSelectorReducer';
import { fileSelected, removeFile, startProcessing, finishedProcessing} from '../../../../components/file_selector/actions';
describe('FileSelector - Reducers', () => {
    it('FILE_REMOVE', ()=>{
        var newState = FileSelectorReducer({}, removeFile() );
        expect(newState.selectedFile).toBe(null);
        expect(newState.errors.length).toBe(0);
        expect(newState.status).toBe('EMPTY');
    });
    it('FILE_SELECTED', ()=>{
        var results = fileSelected(
            {name:'test.xls'},
            {
                allowedFileTypes: ['xls', 'xlsx'],
                allowedFileTypesErrorMsg: "failed reason 123"
            }
        );
        var newState = FileSelectorReducer({}, results );
        expect(newState.selectedFile.name).toBe('test.xls');
        expect(newState.errors.length).toBe(0);
        expect(newState.status).toBe('READY');
    });
    it('START_PROCESSING', ()=>{
        var newState = FileSelectorReducer({}, startProcessing() );
        expect(newState.status).toBe('PROCESSING');
    });
    it('FINISHED_PROCESSING', ()=>{
        var newState = FileSelectorReducer({}, finishedProcessing() );
        expect(newState.status).toBe('EMPTY');
        expect(newState.selectedFile).toBe(null);
        expect(newState.errors.length).toBe(0);
    });
});
