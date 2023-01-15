import {
  INITIAL, TOKENCHECK,HSET,
  NINSERT,NUPDATE,NDELETE,NAUPDATE,
  PINSERT,PUPDATE,PDELETE,PAUPDATE,
  LINSERT,LUPDATE,LDELETE,
} from '../Types';

const monthNames = [];
monthNames['Jan'] = '01';
monthNames['Feb'] = '02';
monthNames['Mar'] = '03';
monthNames['Apr'] = '04';
monthNames['May'] = '05';
monthNames['Jun'] = '06';
monthNames['Jul'] = '07';
monthNames['Aug'] = '08';
monthNames['Sep'] = '09';
monthNames['Oct'] = '10';
monthNames['Nov'] = '11';
monthNames['Dec'] = '12';

const initialState = {
  nurses: [],
  patients: [],
  levels: [],
  holidays: [],
  monthNames:monthNames
  };

export default function BasicReducer(state = initialState, action) {
  let key;
  switch (action.type) {
    case INITIAL:
      return {
        ...state,
        nurses: action.data.nurses,
        patients: action.data.patients,
        levels: action.data.levels,
        holidays: action.data.holidays,
      };
    case NINSERT:
      return {
        ...state,
        nurses:[...state.nurses,{...action.nurse}]
      };
    case NUPDATE:
      state.nurses.map((nurse,index)=>{
        if(nurse._id == action.nurse._id){
          key = index;
        }
      });
      state.nurses[key] = {...action.nurse};
      return {
        ...state,
        nurses:[...state.nurses],
      };
    case NDELETE:
      state.nurses.map((nurse,index)=>{
        if(nurse._id == action._id){
          key = index;
        }
      });
      state.nurses.splice(key,1);
      return {
        ...state,
        nurses:[...state.nurses],
      };
    case NAUPDATE: 
      state.nurses = action.nurses;
      return {
        ...state,
        nurses:[...state.nurses],
      };
    case PINSERT:
      return {
        ...state,
        patients:[...state.patients,{...action.patient}]
      };
    case PUPDATE: 
      state.patients.map((patient,index)=>{
        if(patient._id == action.patient._id){
          key = index;
        }
      });
      state.patients[key] = {...action.patient};
      return {
        ...state,
        patients:[...state.patients],
      };
    case PDELETE:
      state.patients.map((patient,index)=>{
        if(patient._id == action._id){
          key = index;
        }
      });
      state.patients.splice(key,1);
      return {
        ...state,
        patients:[...state.patients],
      };
    case PAUPDATE: 
      state.patients = action.patients;
      return {
        ...state,
        patients:[...state.patients],
      };
    case LINSERT:
      return {
        ...state,
        levels:[...state.levels,{...action.level}]
      };
    case LUPDATE: 
      state.levels.map((level,index)=>{
        if(level._id == action.level._id){
          key = index;
        }
      });
      state.levels[key] = {...action.level};
      return {
        ...state,
        levels:[...state.levels],
      };
    case LDELETE:
      state.levels.map((level,index)=>{
        if(level._id == action._id){
          key = index;
        }
      });
      state.levels.splice(key,1);
      return {
        ...state,
        levels:[...state.levels],
      };
    case HSET:
      return {
        ...state,
        holidays:[...action.holidays],
      };
    case TOKENCHECK:{
      return {
        ...state,
        nurses: action.data.nurses,
        patients: action.data.patients,
        levels: action.data.levels,
      };
    }
    default:
      return state;
  }
}