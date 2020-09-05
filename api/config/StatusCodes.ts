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
    Failure: 1043,
  },
  UpdateGarageCodes: {
    Success: 1060,
    GarageNotFound: 1061,
    GarageAlreadyRegistered: 1062,
    Failure: 1063,
  },
};
