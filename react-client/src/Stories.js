import React from 'react';
import {getHeaders} from './utils';
class Stories extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            stories: []
        }
        // initialization code here
        this.getStoriesFromServer();
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    getStoriesFromServer () {
        fetch('/api/stories', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                stories: data
            })
        })
    }

    render () {
        return (
            <div class="stories">
                { 
                    this.state.stories.map(story => {
                        return (
                            <div key={'user'+ story.user.id} class="pic">
                                <img src={story.user.thumb_url} />
                                <p>{story.user.username}</p>
                            </div>
                            
                        )
                    })
                }
            </div>
        )
    }

}

export default Stories;