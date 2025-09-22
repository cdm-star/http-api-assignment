const users = {};

const respond = (request, response, status, object) => {
  const accept = request.headers.accept || 'application/json';

  if (accept.includes('text/xml')) {
    let responseXML = '<response>';
    responseXML += `<message>${object.message}</message>`;
    if (object.id) responseXML += `<id>${object.id}</id>`;
    responseXML += '</response>';

    response.writeHead(status, { 'Content-Type': 'text/xml' });
    response.write(responseXML);
    response.end();
  } else {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
  }
};

const success = (request, response) => respond(request, response, 200, { message: 'This is a successful response' });

const badRequest = (request, response) => {
  if (request.query && request.query.valid === 'true') {
    return respond(request, response, 200, { message: 'This request has the required parameters' });
  }

  return respond(request, response, 400, {
    message: 'Missing valid query parameter set to true',
    id: 'badRequest',
  });
};

const unauthorized = (request, response) => {
  if (request.query && request.query.loggedIn === 'yes') {
    return respond(request, response, 200, { message: 'You are logged in!' });
  }

  return respond(request, response, 401, {
    message: 'Missing loggedIn query parameter set to yes',
    id: 'unauthorized',
  });
};

const forbidden = (request, response) => respond(request, response, 403, {
  message: 'This request is forbidden',
  id: 'forbidden',
});

const internal = (request, response) => respond(request, response, 500, {
  message: 'This request is internal',
  id: 'internalError',
});

const notImplemented = (request, response) => respond(request, response, 501, {
  message: 'This request is not implemented',
  id: 'notImplemented',
});

const notFound = (request, response) => respond(request, response, 404, {
  message: 'The page your looking for is not found',
  id: 'notFound',
});

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};

