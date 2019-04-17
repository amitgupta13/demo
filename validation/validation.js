const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

module.exports = {
    userValidation: userValidation,
    betValidation:betValidation,
    playerValidation:playerValidation,
    verifyValidation:verifyValidation,
    loginValidation:loginValidation,
    resultValidation:resultValidation,
    getBetsValidation:getBetsValidation,
    getBetValidation:getBetValidation,
    joinValidation:joinValidation,
    winnerValidation:winnerValidation
} 
/*

user validation
Author-Amit Gupta

*/
function userValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'name': {
        notEmpty: {
            errorMessage: 'Name is required'
        },
      errorMessage: 'Name is required'
    },
    'phone': {
        notEmpty: {
            errorMessage: 'phone is required'
        },
        matches: {
            options: [/^[\+]?[0-9]*$/],
            errorMessage: 'phone no should only contain numbers'
        },
        errorMessage: 'phone is required'
    },
    'deviceId': {
        notEmpty: {
            errorMessage: 'device_id is required'
        },
      errorMessage: 'device_id is required'
    },
    'deviceType': {
        notEmpty: {
            errorMessage: 'device_type is required'
        },
      errorMessage: 'device_type is required'
    },
    'countryCode': {
      notEmpty: {
          errorMessage: 'countryCode is required'
      },
    errorMessage: 'countryCode is required'
  }

  });



req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

verify validation
Author-Amit Gupta

*/
function verifyValidation(req, res, next){
  req.checkBody({
    'otp':{
      notEmpty:{
        errorMessage:'otp is required'
      },
      errorMessage:'otp is required'
    },
    'phone':{
      notEmpty:{
        errorMessage:'phone is required'
      },
      errorMessage:'phone is required'
    }

  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

bet validation
Author-Amit Gupta

*/
function betValidation(req, res, next){
  req.checkBody({
    'betDetails':{
      notEmpty:{
        errorMessage:'betDetails is required'
      },
      errorMessage:'betDetails is required'
    },
    'currencyIcon':{
      notEmpty:{
        errorMessage:'currencyIcon is required'
      },
      errorMessage:'currencyIcon is required'
    },
    'answers':{
      notEmpty:{
        errorMessage:'answers are required'
      },
      errorMessage:'answers are required'
    },
    'stake':{
      notEmpty:{
        errorMessage:'stake is required'
      },
      errorMessage:'stake is required'
    },
    'endDate':{
      notEmpty:{
        errorMessage:'enddate is required'
      },
      errorMessage:'enddate is required'
    },
    'userId':{
      notEmpty:{
        errorMessage:'userId is required'
      },
      errorMessage:'userId is required'
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

player validation
Author-Amit Gupta

*/
function playerValidation(req, res, next){
  req.checkBody({
    'answer':{
      notEmpty:{
        errorMessage:'answer is required'
      },
      errorMessage:'answer is required'
    },
    'userId':{
      notEmpty:{
        errorMessage:'userId is required'
      },
      errorMessage:'userId is required'
    },
    'betId':{
      notEmpty:{
        errorMessage:'betId is required'
      },
      errorMessage:'betId is required'
    }

  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

login validation
Author-Amit Gupta

*/
function loginValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'phone': {
        notEmpty: {
            errorMessage: 'phone is required'
        },
      errorMessage: 'phone is required'
    }

  });

req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

result validation
Author-Amit Gupta

*/
function resultValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'result': {
        notEmpty: {
            errorMessage: 'result is required'
        },
      errorMessage: 'result is required'
    },
    'betId': {
      notEmpty: {
          errorMessage: 'betId is required'
      },
    errorMessage: 'betId is required'
  }

  });

req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

getBets validation
Author-Amit Gupta

*/
function getBetsValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'userId': {
        notEmpty: {
            errorMessage: 'userId is required'
        },
      errorMessage: 'userId is required'
    }

  });

req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

getBet validation
Author-Amit Gupta

*/
function getBetValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'userId': {
        notEmpty: {
            errorMessage: 'userId is required'
        },
      errorMessage: 'userId is required'
    },

    'betId': {
      notEmpty: {
          errorMessage: 'betId is required'
      },
    errorMessage: 'betId is required'
  }

  });

req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

join lobby validation
Author-Amit Gupta

*/
function joinValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'userId': {
        notEmpty: {
            errorMessage: 'userId is required'
        },
      errorMessage: 'userId is required'
    },

    'lobbyId': {
      notEmpty: {
          errorMessage: 'lobbyId is required'
      },
    errorMessage: 'lobbyId is required'
  },
  'answer': {
    notEmpty: {
        errorMessage: 'answer is required'
    },
  errorMessage: 'answer is required'
}

  });

req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}

/*

winner validation
Author-Amit Gupta

*/
function winnerValidation(req, res, next) {
  // validate input request
  req.checkBody({
    'lid': {
        notEmpty: {
            errorMessage: 'lid is required'
        },
      errorMessage: 'lid is required'
    }

  });

req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      // return error if there is validation error
      return res.status(422)
      .json({
        status: 'exception',
        data: result.array(),
        message: 'Validation Failed'
      });
    } else {
      return next();
    }
  });
}