import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component {
  
    constructor(props) {
        super(props);
        // binding "this"
        
        this.addedComment = React.createRef();
        
        this.createComment = this.createComment.bind(this);
        
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }


    createComment () {
        // fetch POST: /api/posts/likes
        const url = '/api/comments';
        const postData = {
            post_id: this.props.post.id,
            text: this.addedComment.current.value
        }
        console.log('create comment', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'POST',
            body: JSON.stringify(postData)
        }).then(response => response.json())
        .then(data => {
            // needs to trigger a post redraw:
            console.log(data);
            this.props.refreshPost();
            this.addedComment.current.value = ''
            
        })
    }

    render () {
        return(
            <div>
                <i class="far fa-smile"></i>
                <input type="text" placeholder="Add a comment..."  ref={this.addedComment}/>
                <button 
                    onClick={this.createComment}>
                    Post
                </button>
            </div>
        )
    }
}


export default AddComment;