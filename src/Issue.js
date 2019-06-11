import React from 'react';
import './App.css';
import './Issue.css';

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: props.state,
    };
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.url = props.url;

    this.handleSetPending = this.handleSetPending.bind(this);
    this.handleSetClosed = this.handleSetClosed.bind(this);
  }

  handleSetPending() {
    this.handleStateChange('pending');
  }

  handleSetClosed() {
    this.handleStateChange('closed');
  }

  handleStateChange(state) {
    fetch(this.url + '/' + this.id, {
      body: JSON.stringify({ state }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    })
      .then(res => res.json())
      .then(issue => {
        this.setState({ state: issue.state });
      })
      .catch(() => {
        // @TODO: Decide how to notify user about an error
      });
  }

  render() {
    const availableStates = [];
    if (this.state.state === 'open') {
      availableStates.push({ onClick: this.handleSetPending, state: 'pending' });
    }
    if (this.state.state === 'open' || this.state.state === 'pending') {
      availableStates.push({ onClick: this.handleSetClosed, state: 'closed' });
    }
    return (
      <li className={'issue issue-' + this.state.state}>
        <span className="issue-state">{this.state.state}</span>
        <span className="issue-info">
          <h3 className="issue-title">{this.title}</h3>
          <span className="issue-description">{this.description}</span>
          <span className="issue-buttons">
            {availableStates.map(({ onClick, state }) => <button
              key={state}
              onClick={onClick}
              className={'issue-change issue-change-' + state}
            >Set {state}</button>)}
          </span>
        </span>
      </li>
    );
  }
}

export default Issue;
