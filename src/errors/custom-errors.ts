export const customErrors = {
  // 400
  BAD_REQUEST_USER_REGISTERED: {
    message: 'User is already registered',
    code: 4001
  },
  BAD_REQUEST_USER_ACTIVATED: {
    message: 'User is already activated',
    code: 4002
  },

  BAD_REQUEST_USER_NOT_ACTIVATED: {
    message: 'User is not activated',
    code: 4003
  },

  BAD_REQUEST_MOVIE_ID_NOT_CORRECT: {
    message: 'Id of movie is not correct',
    code: 4004
  },

  BAD_REQUEST_NO_TOKEN: {
    message: 'Token is not present'
  },
  BAD_REQUEST_NO_STOCK: {
    message: 'Stock count is zero'
  },
  BAD_REQUEST_WRONG_PRODUCT_COUNT: {
    message: 'Wrong product count'
  },

  BAD_REQUEST_NOT_VALID_FILE: {
    message: 'Not valid file'
  },

  //401
  UNAUTHORIZED_BAD_TOKEN: {
    message: 'Something wrong with token'
  },

  //403
  FORBIDDEN_USER_NOT_CONFIRMED: {
    message: 'User is not confirmed',
    code: 4031
  },
  FORBIDDEN_USER_PASSWORD_NOT_UPDATED: {
    message: 'User password is not updated',
    code: 4032
  },

  // 404
  NOT_FOUND: {
    message: 'Record not found'
  },
  MOVIE_NOT_FOUND: {
    message: 'User is not found',
    code: 4041
  }
};
