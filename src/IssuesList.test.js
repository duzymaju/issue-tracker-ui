import waitUntil from 'async-wait-until';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import nock from 'nock';
import React from 'react';
import IssuesList from './IssuesList';

Enzyme.configure({ adapter: new Adapter() });

describe(`IssuesList test`, () => {
  describe(`initiating test`, () => {
    beforeAll(() => {
      const request = nock('http://localhost/api/v1');
      request
        .get('/issues')
        .once()
        .reply(200, []);
      request
        .get('/issues')
        .once()
        .reply(200, [
          { description: 'test description', id: 1, state: 'open', title: 'test title' },
        ]);
      request
        .get('/issues')
        .once()
        .reply(500);
    });

    it('renders component with empty list', async () => {
      const component = mount(<IssuesList url="http://localhost/api/v1/issues" />);
      expect(component.state('issues').length).toBe(0);
      await waitUntil(() => component.state('loaded') === true);
      expect(component.state('issues').length).toBe(0);
    });

    it('renders component with one-element list', async () => {
      const component = mount(<IssuesList url="http://localhost/api/v1/issues" />);
      expect(component.state('issues').length).toBe(0);
      await waitUntil(() => component.state('loaded') === true);
      expect(component.state('issues').length).toBe(1);
    });

    it('returns error in case of problems with connection', async () => {
      const component = mount(<IssuesList url="http://localhost/api/v1/issues" />);
      expect(component.state('loadingError')).toBe(null);
      await waitUntil(() => component.state('loaded') === true);
      expect(component.state('loadingError')).not.toBe(null);
    });
  });

  describe(`events test`, () => {
    beforeAll(() => {
      const request = nock('http://localhost/api/v1');
      request
        .get('/issues')
        .once()
        .reply(200, [
          { description: 'test description', id: 1, state: 'pending', title: 'test title' },
          { description: 'test description', id: 2, state: 'pending', title: 'test title' },
        ]);
      request
        .post('/issues', { description: 'test description', title: 'test title' })
        .twice()
        .reply(200, { description: 'test description', id: 3, state: 'open', title: 'test title' });
    });

    it('creates new element', async () => {
      const component = mount(<IssuesList url="http://localhost/api/v1/issues" />);
      await waitUntil(() => component.state('loaded') === true && component.state('issues').length === 2);
      component.setState({ description: 'test description', title: 'test title' });
      component.find('.issues-form').simulate('submit');
      await waitUntil(() => component.state('issues').length === 3);
    });
  });
});
