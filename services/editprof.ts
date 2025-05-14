import api from './api';


export const editprofil = (data : FormData) => {
    return api.post('/editprofile/changeinfo', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const changepfp = (data : FormData) => {
  return api.post('/editprofile/ProfilePic', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

export const deletepfp = (data : FormData) => {
  return api.post('/editprofile/DeleteProfilePic', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};