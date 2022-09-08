import React from 'react';
import {getHeaders} from './utils';

class BookmarkButton extends React.Component {
  
    constructor(props) {
        super(props);
        // binding "this"
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.createBookmark = this.createBookmark.bind(this);
        this.removeBookmark = this.removeBookmark.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleBookmark () {
        if(this.props.bookmarkId) {
            this.removeBookmark();
        } else {
            this.createBookmark();
        }
    }

    createBookmark () {
        // fetch POST: /api/posts/Bookmarks
        const url = '/api/bookmarks';
        const postData = {
            post_id: this.props.postId
        }
        console.log('create bookmark', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'POST',
            body: JSON.stringify(postData)
        }).then(response => response.json())
        .then(data => {
            // needs to trigger a post redraw:
            console.log(data);
            this.props.refreshPost();
        })
    }

    removeBookmark () {
        const url = '/api/bookmarks/' + this.props.bookmarkId;
        console.log('remove bookmark', url);
        fetch(url, {
            headers: getHeaders(),
            method: 'DELETE'
        }).then(response => response.json())
        .then(data => {
            // needs to trigger a post redraw:
            console.log(data);
            this.props.refreshPost();
        })
    }

    render () {
        const bookmarkId = this.props.bookmarkId;
        const bookmarkClass = (bookmarkId ? 'fas' : 'far') + ' fa-bookmark';
        return (
            <button 
                onClick={this.toggleBookmark}
                aria-label="Bookmark / Unbookmark">
                <i className={bookmarkClass}></i>
            </button>
        )
    }
}
                

export default BookmarkButton;