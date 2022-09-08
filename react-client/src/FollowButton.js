import React from 'react';
import {getHeaders} from './utils';

class FollowButton extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            followingId: null
        }
        // binding "this"
        this.toggleFollow = this.toggleFollow.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleFollow () {
        if(this.state.followingId) {
            this.unfollowUser();
        } else {
            this.followUser();
        }
    }

    followUser () {
        // fetch POST: /api/posts/likes
        const url = '/api/following/';
        const userData = {
            user_id: this.props.userId
        }
        console.log('create follow', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'POST',
            body: JSON.stringify(userData)
        }).then(response => response.json())
        .then(data => {
            // needs to trigger a post redraw:
            console.log(data);
            this.setState({followingId: data.id})
        })
    }

    unfollowUser () {
        const url = '/api/following/' + this.state.followingId;
        console.log('remove follow', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'DELETE'
        }).then(response => response.json())
        .then(data => {
            // needs to trigger a post redraw:
            console.log(data);
            this.setState({followingId: null})
        })
    }

    render () {
        const followingId = this.state.followingId;
        const followClass = (followingId ? 'unfollow' : 'follow');
        return (
            <button 
                onClick={this.toggleFollow}
                aria-label="Follow">
                {followClass}
            </button>
        )
    }
}
                

export default FollowButton;

