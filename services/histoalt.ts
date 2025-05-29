import api from './api';

export const historique = (data : FormData) => {
    return api.post('/historiquealert/historique', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};