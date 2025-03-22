This project uses Astro action defined in src/actions/index.ts for RPC style communiation between client and server.

Ensure that the action always returns an appropriate error code in case of an error

The code property accepts human-readable versions of all HTTP status codes. The following codes are supported:

BAD_REQUEST (400): The client sent invalid input. This error is thrown when an action input validator fails to validate.
UNAUTHORIZED (401): The client lacks valid authentication credentials.
FORBIDDEN (403): The client is not authorized to access a resource.
NOT_FOUND (404): The server cannot find the requested resource.
METHOD_NOT_SUPPORTED (405): The server does not support the requested method.
TIMEOUT (408): The server timed out while processing the request.
CONFLICT (409): The server cannot update a resource due to a conflict.
PRECONDITION_FAILED (412): The server does not meet a precondition of the request.
PAYLOAD_TOO_LARGE (413): The server cannot process the request because the payload is too large.
UNSUPPORTED_MEDIA_TYPE (415): The server does not support the request’s media type. Note: Actions already check the Content-Type header for JSON and form requests, so you likely won’t need to raise this code manually.
UNPROCESSABLE_CONTENT (422): The server cannot process the request due to semantic errors.
TOO_MANY_REQUESTS (429): The server has exceeded a specified rate limit.
CLIENT_CLOSED_REQUEST (499): The client closed the request before the server could respond.
INTERNAL_SERVER_ERROR (500): The server failed unexpectedly.
NOT_IMPLEMENTED (501): The server does not support the requested feature.
BAD_GATEWAY (502): The server received an invalid response from an upstream server.
SERVICE_UNAVAILABLE (503): The server is temporarily unavailable.
GATEWAY_TIMEOUT (504): The server received a timeout from an upstream server.