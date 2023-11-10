/* eslint-disable */
export class ApiError {
  static PREVENT = "prevent";

  /**
   * Ошибка верификации данных
   * @type {string}
   */
  static VERIFICATION_ERROR = "VERIFICATION_ERROR";

  /**
   * Ошибка входных фильров апи
   * @type {string}
   */
  static IN_FILTERS_ERROR = "IN_FILTERS_ERROR";

  /**
   * Ошибка выходных фильтрв апи
   * @type {string}
   */
  static OUT_FILTERS_ERROR = "OUT_FILTERS_ERROR";

  /**
   * API вернул ошибку
   * @type {string}
   */
  static ERROR_RESPONSE = "ERROR_RESPONSE";

  /**
   * Необработанная ошибка сервера - вернулся не json файл
   * @type {string}
   */
  static SERVER_ERROR = "SERVER_ERROR";

  /**
   * @param {*} [params] - params
   * @param {number|string?} [params.code?] - код ошибки
   * @param {{}|{name:string, message:string}[]?} [params.fields] - список ошибок в конкретном поле
   * @param {string|{title:string, body:string}?} [params.message] - общее сообщение
   * @param {string?} [params.response] - необработанный ответ от сервера
   */
  constructor({ errors, code, fields, message, response }) {
    this.code = code;
    this.fields = fields;
    this.message = message;
    this.response = response;
    this.errors = errors || {};
    this.errorsCount = 0;
  }

  static fromApiResponse(info) {
    const data = info && info.data;
    const { errors, status, message, name } = data || {};

    if (message)
      Object.keys(message).forEach(key => {
        if (!Array.isArray(message[key])) return;

        const errors = [];
        message[key].forEach(error => {
          errors.push({[key]: error});
        });
        message[key] = errors;
      });
    return new ApiError({
      code: name,
      errors: errors || message,
      fields: message,
      message: (message && message["-"]) || name
    });
  }

  static fromHttpError(xhr) {
    return new ApiError({
      code: xhr.status,
      message: xhr.statusText,
      response: xhr.responseText
    });
  }

  isError() {
    return this.errorsCount > 0;
  }

  addErrorMessage(label, message) {
    if (message) {
      if (!Array.isArray(message)) {
        message = [message];
      }

      if (message.length > 0) {
        this.errors[label] = (this.errors[label] || []).concat(message);
        this.errorsCount += message.length;
      }
    }
  }

  /**
   * @param {Object} error
   */
  extend(error) {
    if (error.errors) {
      Object.keys(error.errors).forEach(key =>
        this.addErrorMessage(key, error.errors[key])
      );
    }
  }
}
