import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const accessToken = localStorage.getItem('accessToken');

  const requestWithAccessToken = request.clone({
    withCredentials: true,
    setHeaders: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return next(requestWithAccessToken);
};
