export const addTemporaryLayer = (id, sourceId, visibility, title, isVisible) => ({
  type: 'ADD_TEMPORARY_LAYER',
  payload: { id, sourceId, visibility, title, isVisible }
});

export const deleteTemporaryLayer = (id) => ({
  type: 'DELETE_TEMPORARY_LAYER',
  payload: id
});

export const resetTemporaryLayers = () => ({
  type: 'RESET_TEMPORARY_LAYERS'
});

export default function temporaryLayersReducer(state = { temporaryLayers: [] }, action) {
  switch (action.type) {
    case 'ADD_TEMPORARY_LAYER':
      return { ...state, temporaryLayers: [...state.temporaryLayers, action.payload] };
    case 'DELETE_TEMPORARY_LAYER':
      return { ...state, temporaryLayers: state.temporaryLayers.filter(layer => layer.id !== action.payload) };
      case 'RESET_TEMPORARY_LAYERS':
  return { ...state, temporaryLayers: [] };
    case 'CHANGE_VISIBLE':
      return {...state, temporaryLayers: state.temporaryLayers.map( (layer) => layer.id === action.payload.id ? {...layer, isVisible: action.payload.visible} : layer)}
    default:
      return state;

  }

};