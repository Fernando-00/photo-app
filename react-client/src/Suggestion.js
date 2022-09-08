import React from 'react';
import {getHeaders} from './utils';
import FollowButton from './FollowButton';
class Suggestion extends React.Component {
  
    constructor(props) {
        super(props);
        // initialization code here
        
    }



    componentDidMount() {
        // fetch posts and then set the state...
    }

    

    render () {
        
        const suggestion = this.props.model

        return (
            <section>
                <img src={suggestion.thumb_url}/>
                
                <p>{suggestion.username}</p>

                <FollowButton 
                    userId = {suggestion.id}
                    refreshSuggestion={this.refreshSuggestionDataFromServer} 
                    />

            </section>
        )
    }

}

export default Suggestion;
