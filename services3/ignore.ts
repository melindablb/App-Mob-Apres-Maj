import api3 from './api3';


export const ignore1 = (data : FormData) => {
    return api3.post('/Objectconnexion/createSmartwatch', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const ignore2 = (data : FormData) => {
    return api3.post('/Objectconnexion/disconnectSmartwatch', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};