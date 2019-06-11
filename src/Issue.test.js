import waitUntil from 'async-wait-until';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import nock from 'nock';
import React from 'react';
import { create } from 'react-test-renderer';
import Issue from './Issue';

Enzyme.configure({ adapter: new Adapter() });

describe(`Issue test`, () => {
  describe(`rendering test`, () => {
    it('renders component with state "open" and two buttons', () => {
      const component = create(<Issue state="open" />);
      const rootInstance = component.root;
      const buttons = rootInstance.findAllByType('button');
      expect(buttons.length).toBe(2);
    });

    it('renders component with state "pending" and one button', () => {
      const component = create(<Issue state="pending" />);
      const rootInstance = component.root;
      const buttons = rootInstance.findAllByType('button');
      expect(buttons.length).toBe(1);
    });

    it('renders component with state "closed" and no button', () => {
      const component = create(<Issue state="closed" />);
      const rootInstance = component.root;
      const buttons = rootInstance.findAllByType('button');
      expect(buttons.length).toBe(0);
    });
  });

  describe(`events test`, () => {
    beforeAll(() => {
      const request = nock('http://localhost/api/v1');
      request
        .patch('/issues/3', { state: 'pending' })
        .once()
        .reply(200, {
          id: 3,
          state: 'pending',
        });
      request
        .patch('/issues/3', { state: 'closed' })
        .twice()
        .reply(200, {
          id: 3,
          state: 'closed',
        });
    });

    it('changes state from open to pending', async () => {
      const component = mount(<Issue id="3" state="open" url="http://localhost/api/v1/issues" />);
      component.find('button.issue-change-pending').simulate('click');
      await waitUntil(() => component.state('state') === 'pending');
    });

    it('changes state from open to closed', async () => {
      const component = mount(<Issue id="3" state="open" url="http://localhost/api/v1/issues" />);
      component.find('button.issue-change-closed').simulate('click');
      await waitUntil(() => component.state('state') === 'closed');
    });

    it('changes state from pending to closed', async () => {
      const component = mount(<Issue id="3" state="pending" url="http://localhost/api/v1/issues" />);
      component.find('button.issue-change-closed').simulate('click');
      await waitUntil(() => component.state('state') === 'closed');
    });
  });
});
