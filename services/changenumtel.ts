import api from './api';

export const ResetNumTel = (data : FormData) => {
    return api.post('/changenumber/phonenumber', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const ResetNumTelCode = (data : FormData) => {
    return api.post('/changenumber/submit-code', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const NewNumTel = (data : FormData) => {
    return api.post('/changenumber/newphonenumber', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

