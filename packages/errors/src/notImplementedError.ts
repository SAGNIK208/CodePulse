import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

class NotImplementedError extends BaseError{
    constructor(methodName){
        super('NOT_IMPLEMENTED',
        StatusCodes.NOT_IMPLEMENTED,
        `${methodName} is not implemented`,
        {});
    }
}

export default NotImplementedError;