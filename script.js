class App extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: "",
            users: [],
            error: null,
            loading: false,
            initialized: null
        };
    }

    onChangeHandle(event) {
        this.setState({ searchText: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();
        const { searchText } = this.state;
        const url = `https://api.github.com/search/users?q=${searchText}`;
        this.setState({ loading: true });
        this.setState({ initialized: 1 });
        fetch(url)
            .then(response => response.json())
            .then(responseJson =>
                this.setState({
                    users: responseJson.items,
                    loading: false,
                    initialized: null
                })
            )
            .catch(error => {
                this.setState({
                    error: "Oh no, something went wrong.." + error,
                    loading: false
                });
            });
    }

    render() {
        console.log("render...", this.state);

        return (
            <div className="container">
                <div className="search">
                    <i className="fab fa-github" />
                    <h1>GitHub</h1>
                    {this.state.loading ? (
                        <p>Searching...</p>
                    ) : (
                        <form onSubmit={event => this.onSubmit(event)}>
                            <label htmlFor="searchText">
                                Search by user name
                            </label>
                            <input
                                type="text"
                                id="searchText"
                                onChange={event => this.onChangeHandle(event)}
                                value={this.state.searchText}
                            />
                        </form>
                    )}
                </div>
                <UsersList users={this.state.users} />
                {this.state.error ? <p>{this.state.error}</p> : null}
                {this.state.users.length === 0 && this.state.initialized ? (
                    <p>Sorry but no user found</p>
                ) : null}
            </div>
        );
    }
}
class UsersList extends React.Component {
    get users() {
        return this.props.users.map(user => <User key={user.id} user={user} />);
    }

    render() {
        return <div className="users">{this.users}</div>;
    }
}

class User extends React.Component {
    render() {
        return (
            <div className="user">
                <img
                    src={this.props.user.avatar_url}
                    style={{ maxWidth: "100px" }}
                />
                <a href={this.props.user.html_url} target="_blank">
                    {this.props.user.login}
                </a>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById("root"));
