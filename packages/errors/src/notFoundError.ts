import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

class NotFound extends BaseError {
    constructor(resourceName:string, resourceValue:string) {
        super("NotFound", StatusCodes.NOT_FOUND, `The requested resource: ${resourceName} with value ${resourceValue} not found`, {
            resourceName,
            resourceValue
        });
    }
}

export default NotFound;