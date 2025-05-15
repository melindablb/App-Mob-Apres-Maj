import api3 from './api3';


export const ConnectSmartwatchNG = (data : FormData) => {
    return api3.post('/Objectconnexion/createSmartwatchNewGen', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const DisconnectSmartwatchNG = (data : FormData) => {
    return api3.post('/Objectconnexion/disconnectSmartwatchNewGen', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const GetStateSmartwatchNG = (data : FormData) => {
    return api3.post('/Objectconnexion/getstateSmartwatchNewGen', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });      
};