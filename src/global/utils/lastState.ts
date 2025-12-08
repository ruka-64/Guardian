import { stateDB, type StateData } from '../..';

export const saveLastState = async (data: StateData) => {
  stateDB.data = data;
  await stateDB.write();
};

export const readLastState = () => stateDB.data;
