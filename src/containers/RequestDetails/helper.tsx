import {EVENT_STATUS} from '../../constants/constants';

export const getEventStatus = (status: string) => {
  const {PENDING, COMPLETED} = EVENT_STATUS;
  switch (status) {
    case PENDING:
      return COMPLETED;
    case COMPLETED:
      return PENDING;
    default:
      return PENDING;
  }
};
