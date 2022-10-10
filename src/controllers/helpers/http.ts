import { HttpResponse } from '../interfaces/http';

export function badRequest(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error,
  };
}

export function serverError(error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: error,
  };
}

export function success(data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}