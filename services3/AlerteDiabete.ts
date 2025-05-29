import api3 from './api3';


export const AlerteDiabete = (data : FormData) => {
    return api3.post('/alertediabete/AlerteDiab', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
