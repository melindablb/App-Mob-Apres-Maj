import api2 from './api2';


export const ConnectOBUPat= (data : FormData) => {
    return api2.post('/OBUOVController/createOBUpro', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const DisconnectOBUPat = (data : FormData) => {
    return api2.post('/OBUOVController/disconnectOBUPRO', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const GetStateOBUPat = (data : FormData) => {
    return api2.post('/OBUOVController/getstateOBUPRO', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
