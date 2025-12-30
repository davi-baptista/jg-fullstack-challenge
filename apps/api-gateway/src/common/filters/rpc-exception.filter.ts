import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const error = exception.getError()

    if (typeof error === 'object' && error !== null) {
      const { statusCode, message } = error as any

      return response.status(statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: statusCode ?? 500,
        message: message ?? 'Internal server error',
      })
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
}
