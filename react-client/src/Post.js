import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import AddComment from './AddComment';
import {getHeaders} from './utils';

class Post extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            post: props.model
        }
        this.refreshPostDataFromServer = this.refreshPostDataFromServer.bind(this);
        // initialization code here
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    refreshPostDataFromServer () {
        const url = '/api/posts/' + this.state.post.id;
        fetch(url, {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({
                post: data
            })
        })
    }

    showComments () {
        const post = this.state.post

        if (post.comments.length === 1){
            return (
                
                <p><b>{post.comments[0].user.username}</b>{post.comments[0].text}</p>
            ) 
        }
        else if(post.comments.length > 1){
            return(
                <div>
                    <button>View all {post.comments.length} comments</button>
                    <p><b>{post.comments[post.comments.length - 1].user.username} </b>
                    {post.comments[post.comments.length - 1].text}</p>
                </div>
                
            )
            
        }
        else{
            return(
                <p>No comments...</p>
            )
            
        }
    }

    render () {
        const post = this.state.post;
        return (
            <section 
                className="card">
                <section className="header"><b>{post.user.username}</b></section>
                

                <img src={post.image_url}/>
                
                <section className="buttons"> 
                <LikeButton 
                    likeId={post.current_user_like_id}
                    postId={post.id}
                    refreshPost={this.refreshPostDataFromServer} />
               

                <BookmarkButton 
                    bookmarkId={post.current_user_bookmark_id}
                    postId={post.id}
                    refreshPost={this.refreshPostDataFromServer} />

                
                </section>

                <section className="caption"><b>{post.user.username} </b>{post.caption}</section>
                    {this.showComments()}
                
                    <AddComment 
                        post={post}
                        refreshPost={this.refreshPostDataFromServer} />
                
                
                

                
                
            </section>
        )
    }
}
                

export default Post;


