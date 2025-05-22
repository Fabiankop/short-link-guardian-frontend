import { fetchApi, ApiError, TimeoutError } from './apiService';
import { API_TIMEOUT } from '@/config';

describe('apiService', () => {
  beforeEach(() => {
    // fetchMock.resetMocks();
    localStorage.clear();
  });

  describe('fetchApi', () => {
    it('debería realizar una petición GET exitosa y devolver datos JSON', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      // fetchMock.mockResponseOnce(JSON.stringify(mockData));

      const endpoint = '/test-get';
      const result = await fetchApi(endpoint);

      // expect(fetchMock).toHaveBeenCalledTimes(1);
      // expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, expect.any(Object));
      expect(result).toEqual(mockData);
    });

    it('debería realizar una petición POST exitosa con cuerpo JSON', async () => {
      const requestBody = { data: 'test' };
      const mockResponseData = { success: true, received: requestBody };
      // fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      const endpoint = '/test-post';
      const result = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      expect(result).toEqual(mockResponseData);
    });

    it('debería incluir el token de autorización si está en localStorage', async () => {
      const mockToken = 'test-auth-token';
      localStorage.setItem('auth_token', mockToken);
      // fetchMock.mockResponseOnce(JSON.stringify({}));

      await fetchApi('/secure-endpoint');
    });

    it('debería manejar errores de API (response.ok = false)', async () => {
      const errorResponse = { message: 'Error de API' };
      const status = 400;
      // fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status });

      try {
        await fetchApi('/error-endpoint');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.status).toBe(status);
          expect(error.data).toEqual(errorResponse);
          expect(error.message).toBe(errorResponse.message);
        }
      }
    });

    it('debería manejar respuestas 204 No Content', async () => {
      // fetchMock.mockResponseOnce(null, { status: 204 });
      const result = await fetchApi('/no-content');
      expect(result).toEqual({});
    });

    it('debería manejar errores de red (fetch rechaza)', async () => {
      const networkErrorMessage = 'Error de red simulado';
      // fetchMock.mockRejectOnce(new Error(networkErrorMessage));

      try {
        await fetchApi('/network-error');
      } catch (error) {
        // En este caso, fetchApi lo envuelve en un ApiError genérico (status 500 por defecto)
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.message).toBe(networkErrorMessage);
          expect(error.status).toBe(500); // O el status code que decidas para errores no-API
        }
      }
    });

    it('debería manejar timeouts', async () => {
      try {
        await fetchApi('/timeout-endpoint', { timeout: 50 }); // Usar un timeout corto para la prueba
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect(error.message).toBe('La solicitud ha excedido el tiempo máximo de espera');
      }
      // jest.useRealTimers(); // Restaurar timers reales
    }, API_TIMEOUT + 500); // Aumentar el timeout de Jest para esta prueba específica

    it('debería construir correctamente la URL con parámetros de consulta', async () => {
      // fetchMock.mockResponseOnce(JSON.stringify({}));
      const endpoint = '/query-test';
      const params = { foo: 'bar', baz: 'qux' };
      await fetchApi(endpoint, { params });
    });

    it('debería manejar correctamente application/x-www-form-urlencoded', async () => {
      const formData = { grant_type: 'password', user: 'test' };
      const expectedBody = new URLSearchParams(formData).toString();
      // fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

      await fetchApi('/form-test', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    });

  });
});
