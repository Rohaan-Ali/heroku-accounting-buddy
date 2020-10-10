module.exports = {
  SignupCodes: {
    Success: 1000,
    EmailAlreadyRegistered: 1001,
    Failure: 1002,
  },
  AddWorkerCodes: {
    Success: 1010,
    GarageNotFound: 1011,
    WorkerAlreadyExists: 1012,
    Failure: 1013,
  },
  SigninCodes: {
    Success: 1020,
    InvalidEmail: 1021,
    IncorrectPassword: 1022,
    Failure: 1023,
  },
  OnboardingGarageCodes: {
    Success: 1040,
    GarageAlreadyRegistered: 1041,
    Failure: 1042,
  },
  ChangePasswordCodes: {
    Success: 1050,
    UserNotFound: 1051,
    PasswordNotConfirmed: 1052,
    InvalidOldPassword: 1053,
    Failure: 1054,
  },
  UpdateGarageCodes: {
    Success: 1060,
    GarageNotFound: 1061,
    Failure: 1062,
  },
  OffboardGarage: {
    Success: 1070,
    GarageNotFound: 1071,
    Failure: 1072,
  },
};
