import api3 from './api3';


export const AlerteWatch = (data : FormData) => {
    return api3.post('/Start/AlerteSimulationTest', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
};
