export enum RoleType {
  NEW_USER = 'NEW_USER',
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export enum AuthMethod {
  EMAIL_AND_PASSWORD = 'EMAIL_AND_PASSWORD',
  GOOGLE = 'GOOGLE',
}

export enum AdminPermission {
  UPDATE_USER = 'UPDATE_USER',
  GET_USER = 'GET_USER',
  PAYOUT = 'PAYOUT',
  VIEW_APPOINTEMENTS = 'VIEW_APPOINTEMENTS',
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}

export enum Genotype {
  AA = 'AA',
  AS = 'AS',
  SS = 'SS',
  AC = 'AC',
  SC = 'SC',
}

export enum BloodGroup {
  OPositive = 'O+',
  BNegative = 'B-',
  BPositive = 'B+',
}

export enum CountryCodes{
    Nigeria = '234',
    Kenya = '254',
    Ghana = '233',
    South_Africa = '27',
    Rwanda = '250', 
    Tanzania = '255',
}
