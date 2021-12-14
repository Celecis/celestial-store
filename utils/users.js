export const initialState = {
  loading: true,
  user: {},
  users: [],
  error: '',
  loadingUpdate: false,
  errorUpdate: '',
  loadingUpload: false,
  errorUpload: '',
  loadingCreate: false,
  loadingDelete: false,
  successDelete: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_USER_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //
    //
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    //
    //
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    //
    //
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    //
    //
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    //
    //
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    //
    //
    default:
      state;
  }
}
