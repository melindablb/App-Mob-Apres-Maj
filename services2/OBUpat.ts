import api2 from './api2';


export const ConnectOBUPat= (data : FormData) => {
    return api2.post('/OBUOVController/createOBUPat', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const DisconnectOBUPat = (data : FormData) => {
    return api2.post('/OBUOVController/disconnectOBUPAT', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const GetStateOBUPat = (data : FormData) => {
    return api2.post('/OBUOVController/getstateOBUPAT', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
