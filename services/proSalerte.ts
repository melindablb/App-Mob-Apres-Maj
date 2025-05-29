import api from './api';

export const ListAlerts = (data : FormData) => {
    return api.post('/ProS/ListAlerts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const SetStatus = (data : FormData) => {
    return api.post('/ProS/SetStatus', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}

export const GetInfoPatMed = (data : FormData) => {
    return api.post('/ProS/GetInfoPatMed', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}

export const AcceptAlert = (data : FormData) => {
    return api.post('/ProS/AcceptAlert', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}

export const FinishAlert = (data : FormData) => {
    return api.post('/ProS/FinishAlert', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}