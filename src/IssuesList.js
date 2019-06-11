import React from 'react';
import Issue from './Issue';
import './IssuesList.css';

class IssuesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingError: null,
      description: '',
      loadingError: null,
      issues: [],
      loaded: false,
      title: '',
    };
    this.url = props.url;

    this.handleAdd = this.handleAdd.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  componentDidMount() {
    fetch(this.url)
      .then(res => res.json())
      .then(issues => {
        this.setState({ loaded: true, issues });
      }, error => {
        this.setState({ loadingError: error, loaded: true });
      })
  }

  handleAdd(event) {
    event.preventDefault();
    const { description, issues, title } = this.state;

    if (!description || !title) {
      this.setState({ addingError: new Error(`Title and description have not to be empty.`) });
      return;
    }
    if (this.state.addingError) {
      this.setState({ addingError: null });
    }

    fetch(this.url, {
      body: JSON.stringify({ description, title }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(res => res.json())
      .then(issue => {
        issues.push(issue);
        this.setState({ description: '', issues, title: '' });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  render() {
    const { addingError, loadingError, issues, loaded } = this.state;
    if (!loaded) {
      return (
        <div className="issues">
          <p className="issues-loader">Issues loading... Please wait.</p>
        </div>
      );
    }
    if (loadingError) {
      return (
        <div className="issues">
          <p className="issues-error">An error occurred during issues loading. Check your connection.</p>
        </div>
      );
    }
    return (
      <div className="issues">
        <ul className="issues-list">
          {issues.map(issue => <Issue
            key={issue.id}
            id={issue.id}
            title={issue.title}
            description={issue.description}
            state={issue.state}
            url={this.url}
          />)}
        </ul>
        <form className="issues-form" onSubmit={this.handleAdd}>
          {addingError ? (<p className="issues-form-error">{addingError.message}</p>) : ''}
          <span>Add issue:</span>
          <input
            type="text"
            value={this.state.title}
            placeholder="title"
            maxLength="100"
            onChange={this.handleTitleChange}
          />
          <input
            type="text"
            value={this.state.description}
            placeholder="description"
            maxLength="200"
            onChange={this.handleDescriptionChange}
          />
          <button type="submit">Add issue</button>
        </form>
      </div>
    );
  }
}

export default IssuesList;
