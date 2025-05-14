import api from './api';

export const ResetPwd = (data : FormData) => {
    return api.post('/passwrodreset/requestcode', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const ResetPwdCode = (data : FormData) => {
    return api.post('/passwrodreset/submit-code', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const NewPwd = (data : FormData) => {
    return api.post('/passwrodreset/nvmdp', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}