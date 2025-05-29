import api3 from './api3';


export const ConnectCGM = (data : FormData) => {
    return api3.post('/Objectconnexion/createCGM', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const DisconnectCGM = (data : FormData) => {
    return api3.post('/Objectconnexion/disconnectCGM', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const GetStateCGM = (data : FormData) => {
    return api3.post('/Objectconnexion/getstateCGM', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const HubDataCGM = (data : FormData) => {
    return api3.post('/Objectconnexion/hubdatacgm', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}