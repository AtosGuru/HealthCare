import {
  INITIAL,TOKENCHECK,HSET,
  NINSERT,NUPDATE,NDELETE,NAUPDATE,
  PINSERT,PUPDATE,LDELETE,PAUPDATE,
  LINSERT,LUPDATE,PDELETE,
} from '../Types';
import { createBrowserHistory  } from 'history';

export const getAllDatas = (data) => {
  return ({
    type: INITIAL,
    data:{
      nurses: data.nurse, 
      patients: data.patient, 
      levels: data.level, 
      holidays: data.holiday, 
    }
  });
}

export const nIns = (data) => {
  return ({
    type: NINSERT,
    nurse: data,
  });
};
export const nUpd = (data) => {
  return ({
    type: NUPDATE,
    nurse: data,
  });
};
export const nDel = (_id) => {
  return ({
    type: NDELETE,
    _id: _id
  });
};
export const pIns = (data) => {
  return ({
    type: PINSERT,
    patient: data,
  });
};
export const pUpd = (data) => {
  return ({
    type: PUPDATE,
    patient: data,
  });
};
export const pDel = (_id) => {
  return ({
    type: PDELETE,
    _id: _id
  });
};

export const nAllUpd = (data) =>{
  return({
    type:NAUPDATE,
    nurses:data.NurseDatas,
  });
}

export const pAllUpd = (data) =>{
  return({
    type:PAUPDATE,
    patients:data.patients,
  });
}

export const lIns = (data) => {
  return ({
    type: LINSERT,
    level: data,
  });
};
export const lUpd = (data) => {
  return ({
    type: LUPDATE,
    level: data,
  });
};
export const lDel = (_id) => {
  return ({
    type: LDELETE,
    _id: _id
  });
};

export const hSet = (data) =>{
  return({
    type:HSET,
    holidays:data.holiday,
  });
}

export const setToken = (data) =>{
  const history = createBrowserHistory();
  history.push('/');
  history.go('/');
  sessionStorage.setItem('token',JSON.stringify(data.token));
  return ({
    type:TOKENCHECK,
    data:data,
  });
};

export const logOut = () =>{
  const history = createBrowserHistory();
  history.push('/login');
  history.go('/login');
  sessionStorage.removeItem('token');
  return ({
  });
};