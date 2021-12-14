export const initialState = {
  loading: true,
  summary: {},
  error: '',
};

export function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUMMARY_SUCCESS':
      return {
        ...state,
        loading: false,
        summary: action.payload,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
