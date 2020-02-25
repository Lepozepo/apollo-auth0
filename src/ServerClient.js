import { RESTDataSource } from 'apollo-datasource-rest';
import { get } from 'lodash';

export default class ServerClient extends RESTDataSource {
  constructor(props) {
    super();

    this.props = {
      ttl: 60,
      willSendRequest() {},
      ...props,
    };
    if (!this.props.domain) throw new Error('Auth0 ServerClient domain is required');
    if (!this.props.clientId) throw new Error('Auth0 ServerClient management clientId is required');
    if (!this.props.clientSecret) throw new Error('Auth0 ServerClient management clientSecret is required');

    this.baseURL = `https://${this.props.domain}`;
  }

  async willSendRequest(request) {
    try {
      // Prevent an infinite loop (caused by the management token request)
      if (request.path === '/oauth/token') return;

      const managementToken = await this.managementToken();
      request.headers.set('Authorization', `Bearer ${managementToken}`);

      this.props.willSendRequest(request);
    } catch (err) {
      throw err;
    }
  }

  get tokenExpired() {
    if (!this._tokenExpiresAt) return true;
    return Date.now() > this._tokenExpiresAt;
  }

  managementToken = async () => {
    try {
      if (!this.tokenExpired) return this._managementToken;

      const data = await this.post(
        '/oauth/token',
        {
          client_id: this.props.clientId,
          client_secret: this.props.clientSecret,
          audience: `https://${this.props.domain}/api/v2/`,
          grant_type: 'client_credentials',
        },
        {
          cacheOptions: { ttl: 0 },
        },
      );
      this._managementToken = data.access_token;
      this._tokenExpiresAt = Date.now() + data.expires_in * 1000;

      return this._managementToken;
    } catch (err) {
      throw get(err, 'response.data.message') || get(err, 'message') || err;
    }
  };

  getUsers(params) {
    return this.get(
      '/api/v2/users',
      {
        ...params,
        search_engine: 'v3',
      },
      {
        cacheOptions: { ttl: this.props.ttl },
      },
    );
  }

  getUser(id, params) {
    return this.get(
      `/api/v2/users/${id}`,
      {
        ...params,
        search_engine: 'v3',
      },
      {
        cacheOptions: { ttl: this.props.ttl },
      },
    );
  }

  getUsersByEmail(params) {
    return this.get(
      '/api/v2/users-by-email',
      {
        ...params,
        search_engine: 'v3',
      },
      {
        cacheOptions: { ttl: this.props.ttl },
      },
    );
  }

  async createUser(user) {
    try {
      const res = await this.post('/api/v2/users', {
        connection: 'Username-Password-Authentication',
        ...user,
      });
      return res;
    } catch (err) {
      throw get(err, 'extensions.response.body.message') || err;
    }
  }

  async resetPassword(id, params) {
    try {
      const { newPassword } = params;
      const res = await this.patch(
        `/api/v2/users/${id}`,
        {
          password: newPassword,
          connection: 'Username-Password-Authentication',
        },
        {
          cacheOptions: { ttl: 0 },
        },
      );

      return res;
    } catch (err) {
      throw get(err, 'extensions.response.body.message') || err;
    }
  }

  sendChangePasswordEmail(email) {
    return this.post(
      '/dbconnections/change_password',
      {
        email,
        connection: 'Username-Password-Authentication',
      },
      {
        cacheOptions: { ttl: 0 },
      },
    );
  }
}
