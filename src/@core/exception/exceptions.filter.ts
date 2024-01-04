import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    Logger.log(exception.getResponse());
    const message = exception.getResponse
      ? exception.getResponse().message
      : exception.message;
    const status = exception.getStatus ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
