import api from './api';


export const FriendAdd = (data : FormData) => {
    return api.post('/procheaddsupp/addedit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const FriendDel = (data : FormData) => {
    return api.post('/procheaddsupp/delete', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const FriendList = (data : string) => {
    return api.post('/procheaddsupp/recupListContact', JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};