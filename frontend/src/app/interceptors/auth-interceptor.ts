import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_ENDPOINTS: { method: string; url: string }[] = [
  { method: 'POST', url: 'http://localhost:8000/api/login' },
  { method: 'POST', url: 'http://localhost:8000/api/users' },
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(
    endpoint => endpoint.method === req.method && endpoint.url === req.url
  );
  
  const token = localStorage.getItem('token');

  if (isPublicEndpoint || !token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
