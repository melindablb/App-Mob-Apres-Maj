import api from './api';


export const signupPatient = (data : FormData) => {
    return api.post('/auth/signupWithFile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const signupProS = (data : FormData) => {
  return api.post('/auth/signupWithFileProS', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

export const signinPatient = (data : FormData) => {
    return api.post('/auth/signinPatient', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}

export const signinProS = (data : FormData) => {
  return api.post('/auth/signinProS', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}
