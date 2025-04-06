import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

class InternalServerError extends BaseError{
    constructor(){
        super('INTERNAL_SERVER_ERROR',
        StatusCodes.INTERNAL_SERVER_ERROR,
        `something went wrong`,
        {});
    }
}

export default InternalServerError;