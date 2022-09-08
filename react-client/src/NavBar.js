import React from 'react';

class NavBar extends React.Component {
  
    constructor(props) {
        super(props);
        console.log('NavBar props:', props);
        // initialization code here
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () {
        return (
            <nav className="main-nav">
                <h1>{this.props.title}</h1> 
                {<a href="url"> API Docs </a>}
                { this.props.username }
                {<a href="url"> Sign out </a>}
                {/* Navigation Links */}
            </nav>
        )
    }

}

export default NavBar;