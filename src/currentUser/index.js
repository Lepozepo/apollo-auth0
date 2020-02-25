import jwt from 'jsonwebtoken';
import isEmpty from 'lodash/isEmpty';
import getKey from './getKey';

export default function currentUser(token, options = {}) {
  if (!options.domain) throw new Error('Auth0 currentUser domain is required');
  if (!options.clientId) throw new Error('Auth0 currentUser clientId is required');

  if (isEmpty(token)) return null;

  return new Promise((resolve) => {
    jwt.verify(token, getKey(options.domain), {
      algorithms: ['RS256'],
      ignoreExpiration: false,
      ...options,
      audience: options.clientId,
      issuer: `https://${options.domain}/`,
    }, (err, decoded) => {
      if (err) return resolve();

      return resolve({
        id: decoded.sub,
        ...decoded,
      });
    });
  });
}
