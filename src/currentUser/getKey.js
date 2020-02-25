import jwksClient from 'jwks-rsa';
import isEmpty from 'lodash/isEmpty';

let _jwskClient;

export default (domain) => {
  if (isEmpty(domain)) throw new Error('apollo-auth0 getKey requires domain');

  if (!_jwskClient) {
    _jwskClient = jwksClient({
      jwksUri: `https://${domain}/.well-known/jwks.json`,
    });
  }

  return function getKey(header, cb) {
    _jwskClient.getSigningKey(header.kid, (err, key) => {
      if (err) return cb(err);

      const signingKey = key.publicKey || key.rsaPublicKey;
      return cb(null, signingKey);
    });
  };
};
