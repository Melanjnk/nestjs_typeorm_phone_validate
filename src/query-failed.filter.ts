import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let msgHttp = '';
    let msg: string = `Database query failed `;
    // @see PhoneValidatorService
    const POSITION_OF_COUNTRY_IN_QUERY = 0;
    if (
      exception.message.includes(
        'duplicate key value violates unique constraint',
      )
    ) {
      msg += ` ${exception.message}`;
      console.log(`Original Msg: ${msg}`);
      msgHttp = `The Property: countryName is unique, \"${exception.parameters[POSITION_OF_COUNTRY_IN_QUERY]}\" already exists in db`;
      console.log(`Pretty Msg for HTTP_RESPONSE: ${msgHttp}`);
    }
    // Customize the error message and status code as needed
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: msgHttp,
    });
  }
}
