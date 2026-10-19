import { describe, expect, it } from 'vitest';

import { httpsUrl, PluginProtocolError } from '../internal/parse.js';

describe('httpsUrl', () => {
  it('accepts HTTPS for public hosts', () => {
    expect(httpsUrl('https://plugins.cindy.app/a.zip', 'response.url')).toBe(
      'https://plugins.cindy.app/a.zip',
    );
  });

  it('accepts plain HTTP for self-hosted loopback and RFC1918 hosts', () => {
    for (const url of [
      'http://127.0.0.1:8080/a.zip',
      'http://localhost:8080/a.zip',
      'http://[::1]:8080/a.zip',
      'http://10.0.0.8:8080/a.zip',
      'http://192.168.1.20:8080/a.zip',
      'http://172.16.3.4:8080/a.zip',
    ]) {
      expect(httpsUrl(url, 'response.url')).toBe(url);
    }
  });

  it('rejects plain HTTP for public hosts', () => {
    for (const url of [
      'http://plugins.cindy.app/a.zip',
      'http://172.32.0.1/a.zip',
      'http://8.8.8.8/a.zip',
      'http://10.evil.com/a.zip',
      'http://127.evil.com/a.zip',
      'http://192.168.evil.com/a.zip',
    ]) {
      expect(() => httpsUrl(url, 'response.url')).toThrow(PluginProtocolError);
    }
  });

  it('rejects non-HTTP protocols and malformed values', () => {
    for (const value of ['ftp://plugins.cindy.app/a.zip', 'not a url', 42]) {
      expect(() => httpsUrl(value, 'response.url')).toThrow(PluginProtocolError);
    }
  });
});
