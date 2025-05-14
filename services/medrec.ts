import api from './api';


export const MedRecP = (data : FormData) => {
    return api.post('/validationmail/PatientUploder', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};

export const MedRecLoad = (data : string) => {
    return api.post('/validationmail/recupListMedRec', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
};

export const MedRecDelete = (data: { Patient: string; Iddossier: string }) => {
  return api.post('/validationmail/deleteListMedRec', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
};