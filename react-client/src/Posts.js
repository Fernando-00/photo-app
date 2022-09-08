import React from 'react';
import {getHeaders} from './utils';
import Post from './Post'

class Posts extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
        // initialization code here
        this.getPostsFromServer()
    }

    getPostsFromServer () {
        fetch('/api/posts', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                posts: data
            })
        })
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () {
        return (
            <div id="posts">
                { 
                    this.state.posts.map(post => {
                        return (
                            <Post 
                                key={'post_' + post.id}
                                model={post}/>
                        )
                    })
                }
            </div>
        )
    }

}

export default Posts;