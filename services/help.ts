import api from './api';


export const SendHelp = (data : FormData) => {
    return api.post('/sending/Help', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};