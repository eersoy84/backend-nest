import {
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

const PASSWORD_RULE =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const PASSWORD_RULE_MESSAGE =
  'şifreniz en az 1 büyük harf, 1 küçük harf, 1 numara ve 1 özel karakter bulundurmalıdır';

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode:
    HttpStatus.UNPROCESSABLE_ENTITY,
});

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
};

export const SETTINGS = {
  VALIDATION_PIPE,
};
