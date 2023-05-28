import { isEmpty, merge } from 'lodash';
import { RequiredInTypes } from './enum';

const checkLowerUpper = (value: string) => {
  return /[A-Z]/.test(value) && /[a-z]/.test(value);
};

const checkNumberSymbol = (value: string) => {
  return /\d/.test(value) || /[\W_]/.test(value);
};

const checkLeast8Char = (value: string) => {
  return value.length >= 8;
};

const checkNoSpaces = (value: string) => {
  return !/\s/.test(value);
};

const validatePassword = (value: string) => {
  return (
    checkLowerUpper(value) &&
    checkNumberSymbol(value) &&
    checkLeast8Char(value) &&
    checkNoSpaces(value)
  );
};

export {
  checkLowerUpper,
  checkNumberSymbol,
  checkLeast8Char,
  checkNoSpaces,
  validatePassword,
};

export const handleGetIdRequest = (
  requestContext: any,
  requiredIn: RequiredInTypes[],
) => {
  const { body, query, params } = requestContext;

  let userIdInRequest: any = null;
  let orgIdInRequest: any = null;
  let roleIdInRequest: any = null;
  let positionIdInRequest: any = null;
  let roleIdsInRequest: any = null;
  let locationIdInRequest: any = null;
  let subjectIdInRequest: any = null;
  let biomarkerIdInRequest: any = null;
  let eventTypeIdInRequest: any = null;
  let eventDiagnosisIdInRequest: any = null;
  let eventRegimenIdInRequest: any = null;
  let eventIdInRequest: any = null;
  let paramsInRequest: any = {};

  if (!isEmpty(requiredIn)) {
    if (!!requiredIn.find((reqIn) => RequiredInTypes.BODY === reqIn)) {
      paramsInRequest = merge(paramsInRequest, body);
    }
    if (!!requiredIn.find((reqIn) => RequiredInTypes.PARAMS === reqIn)) {
      paramsInRequest = merge(paramsInRequest, params);
    }
    if (!!requiredIn.find((reqIn) => RequiredInTypes.QUERY === reqIn)) {
      paramsInRequest = merge(paramsInRequest, query);
    }
  } else {
    paramsInRequest = merge(paramsInRequest, body, params, query);
  }

  const {
    userId,
    organizationId,
    roleId,
    positionId,
    roleIds,
    locationId,
    subjectId,
    biomarkersId,
    organizationEventTypeId,
    organizationEventDiagnosisId,
    organizationEventRegimenId,
    eventsId,
  } = paramsInRequest;

  userIdInRequest = userId;
  orgIdInRequest = organizationId;
  roleIdInRequest = roleId;
  positionIdInRequest = positionId;
  roleIdsInRequest = roleIds;

  locationIdInRequest = locationId;
  subjectIdInRequest = subjectId;
  biomarkerIdInRequest = biomarkersId;
  eventTypeIdInRequest = organizationEventTypeId;
  eventDiagnosisIdInRequest = organizationEventDiagnosisId;
  eventRegimenIdInRequest = organizationEventRegimenId;
  eventIdInRequest = eventsId;

  return {
    userIdInRequest,
    orgIdInRequest,
    roleIdInRequest,
    positionIdInRequest,
    roleIdsInRequest,
    locationIdInRequest,
    subjectIdInRequest,
    biomarkerIdInRequest,
    eventTypeIdInRequest,
    eventDiagnosisIdInRequest,
    eventRegimenIdInRequest,
    eventIdInRequest,
  };
};

export const validateElectronicId = (value: string) => {
  return /^\d{14}$/.test(value);
};
