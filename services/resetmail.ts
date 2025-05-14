import api from './api';

export const ResetEmail = (data : FormData) => {
    return api.post('/changemail/email', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const ResetEmailCode = (data : FormData) => {
    return api.post('/changemail/submit-code', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const NewEmail = (data : FormData) => {
    return api.post('/changemail/validate-sms', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
