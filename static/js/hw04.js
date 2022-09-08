// import getCookie from "utilities"
// TEMPLATES

const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const stringToHTML = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

const post2Html = post => {

    return `
    <section id="post_${post.id}" class="post-card">
    
        <section class="card-header">
            <p><b>${post.user.username}</b></p>
            <i class="fas fa-ellipsis-h"></i>
        </section>
        <section class="post-picture">
            <img src="${post.image_url}" />
        </section>
        <section class="symbols">
            <section class="left-symbols">
                ${ renderLikeButton(post) }
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
            </section>
            <section class="right-symbol">
                ${ renderBookmarkButton(post) }
            </section>
        </section>
        <section class="likes">
            ${renderLikeCount(post)}
        </section>
        <section class="comments">
            <p><b>${post.user.username} </b> ${post.caption}<a href="#"> more </a></p>
            ${ displayComments(post) }
            <div class="comment-date">
                <p>${post.display_time}</p>
            </div>
        </section>
        
        <section class="comment-section">
            <section class="comment-emoji">
                <i class="far fa-smile"></i>
                <input type="text" id="save-comment" placeholder="Add a comment...">
                
            </section>
            <section class="post">
                <button data-post-id = "${post.id}" onclick="addComment(event);" >Post</button>
            </section>
        </section>
    </section>`;
    
   
};


const user2Html = user => {

    return `
    <div class="accounts">
        <section>
            <img src="${user.thumb_url}"" />
    
            <div> 
                <p>${user.username}</p>
                <p1> suggested for you </p1>
            </div>
            
            <div>
                <button 
                    class="follow"
                    aria-label="Follow"
                    aria-checked="false" 
                    data-user-id="${user.id}" 
                    onclick="toggleFollow(event);">follow</button>
            </div>
          
        </section>
    
    </div>`;


};

const profile2Html = user => {
    console.log(user.username)
    return `

            <img src="${user.image_url}"  />
            <h>${user.username}</h>
           
        
    `;


};

const displayComments = post => {
    if (post.comments.length > 1) {
        // display a button
        const commentRecent = post.comments.length - 1
        return `<button data-post-id=${post.id} onclick="showModal(event)">View all ${post.comments.length} Comments</button>
                <p><b>${post.comments[commentRecent].user.username} </b> ${post.comments[commentRecent].text}</p>`;
    } else if (post.comments.length === 1) {
        // display single comment
        console.log(post.comments)
        return `<p><b>${post.comments[0].user.username} </b> ${post.comments[0].text}</p>`
    } else {
        return '';
    }
}


const post2Modal = post => {
    console.log(post.comments)
    return `
        <div class="modal-bg" aria-hidden="false" role="dialog">
            <button class="close" aria-label="Close the modal window" onclick="closeModal(event);">Close</button>

            <section class="modal">

                
                <img id="modal-img" src="${post.image_url}" /> 
                

                <div class="modal-comments">
                    <div class="modal-profile">${getProfile()}</div>
                    <p><img src="${post.user.thumb_url}" /><b>${post.user.username} </b> ${post.caption} </p>
                    
                    ${post.comments.map(comment =>('<p><img src=' + comment.user.thumb_url + '/><b>'+comment.user.username+ '</b>'+ ' ' + comment.text + '</p>')).join('\n') }
                <div>
            </section>
        <div>
    `;
}

const renderLikeCount = post => {
    if (post.likes.length > 1) {
        return `
        <p><b>  ${post.likes.length} likes </b></p>`;
    }
    else {
        return `
        <p><b>  ${post.likes.length} like </b></p>`;
    }
};

const renderLikeButton = post => {
    if (post.current_user_like_id) {
        return `
            <button 
                data-post-id = "${post.id}"
                data-like-id = "${post.current_user_like_id}"
                aria-label="Like / Unlike"
                aria-checked="true"
                onclick="handleLike(event);">
                <i class="fas fa-heart"></i>
            </button>`;
    }
    else {
        return `
            <button 
                data-post-id = "${post.id}"
                aria-label="Like / Unlike"
                aria-checked="false"
                onclick="handleLike(event);">
                <i class="far fa-heart"></i>
            </button>`;
    }
};

const renderBookmarkButton = post => {
    if (post.current_user_bookmark_id) {
        return `
            <button 
                data-post-id = "${post.id}"
                data-bookmark-id = "${post.current_user_bookmark_id}"
                aria-label="Bookmark / Unbookmark"
                aria-checked="true"
                onclick="handleBookmark(event);">
                <i class="fas fa-bookmark"></i>
            </button>`;
    }
    else {
        return `
            <button 
                data-post-id = "${post.id}"
                aria-label="Bookmark / Unbookmark"
                aria-checked="false"
                onclick="handleBookmark(event);">
                <i class="far fa-bookmark"></i>
            </button>`;
    }
};


const showModal = ev => {
    const postId = Number(ev.currentTarget.dataset.postId)
    redrawPost(postId, post => {
        const html = post2Modal(post);
        document.querySelector(`#post_${post.id}`).insertAdjacentHTML('beforeend', html)
    })
}

const closeModal = ev => {
    document.querySelector('.modal-bg').remove();
}

const addComment = ev => {
    // section for input 
    const elem = ev.currentTarget;
    postComment(elem);
    console.log(elem.parentNode.previousElementSibling.querySelector(`input`).value)


}



const handleLike = ev =>{
    console.log("Handle like functionality");
    // if aria-checked true, delete Like object
    // else issue a POST request to create a Like object
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true') {
        unlikePost(elem);
    } else {
        likePost(elem);
    }
    // after everything, redraw post to reflect new status
};

const postComment = elem => {

    const postId = Number(elem.dataset.postId);
    console.log(postId)
    const commentText = elem.parentNode.previousElementSibling.querySelector(`input`).value

    const postData = {
        "post_id": postId,
        "text": commentText
    };
    
    fetch("http://127.0.0.1:5000/api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            redrawPost(postId);
        });
};

const unlikePost = elem => {
    const postId = Number(elem.dataset.postId);
    console.log('unlike post', elem);
    fetch(`/api/posts/likes/${elem.dataset.likeId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log('redraw the post')
        redrawPost(postId)
    });
};

const likePost = elem => {
    const postId = Number(elem.dataset.postId);
    console.log('like post', elem);
    const postData = {
        "post_id": postId
    };
    fetch("/api/posts/likes/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log('redraw the post')
        redrawPost(postId)
    });
};

const redrawPost = (postId, callback) => {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost => {
            if (!callback) {
                redrawCard(updatedPost);
            } else {
                callback(updatedPost)
            }
        })
}

const redrawCard = post => {
    console.log(post)
    const html = post2Html(post);
    const newElement = stringToHTML(html);
    const postElement = document.querySelector(`#post_${post.id}`);
    postElement.innerHTML = newElement.innerHTML;
}

const handleBookmark = ev =>{
    console.log("Handle bookmark functionality");
    // if aria-checked true, delete Bookmark object
    // else issue a POST request to create a bookmark object
    const elem = ev.currentTarget;
    if(elem.getAttribute('aria-checked') === 'true'){
        unbookmarkPost(elem);
    }else{
        bookmarkPost(elem);
    }
};

const unbookmarkPost = elem => {
    console.log('unbookmark post');
    fetch(`/api/bookmarks/${elem.dataset.bookmarkId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
    .then(response => response.json())
    .then(data => {
        redrawPost(elem.dataset.postId)
        console.log(data);
    });
    
};

const bookmarkPost = elem => {
    console.log('bookmark post');
    const postData = {
        "post_id": Number(elem.dataset.postId)
    }
    fetch("/api/bookmarks/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCookie('csrf_access_token')
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        redrawPost(elem.dataset.postId)
        console.log(data);
    });
};


// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

// fetch data from your API endpoint:
const displayPosts = () => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const html = posts.map(post2Html).join('\n');
            document.querySelector('.card').innerHTML = html;
        })
};

const toggleFollow = ev =>{
    
    const elem = ev.currentTarget;
    


    if (elem.getAttribute('aria-checked') === 'false'){
        //issue post request to UI for new follower
        followUser(elem.dataset.userId, elem);

    } else{
        //issue delete request
        unfollowUser(elem.dataset.followingId, elem);
    }

    
};

const followUser = (userId, elem) => {
    const postData = {
        "user_id": parseInt(userId)
    };
    
    fetch("/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow'  
            elem.setAttribute('aria-checked', 'true');       
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            // in the event we want to unfollow somebody
            elem.setAttribute('data-following-id', data.id);
        });
};

const unfollowUser = (followingId, elem) => {
    // issue a delete request
    const deleteURL = `/api/following/${followingId}`;

    
    fetch(deleteURL, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'follow'
            elem.classList.add('follow');
            elem.classList.remove('unfollow');
            elem.removeAttribute('data-following-id');
            elem.setAttribute('aria-checked', 'false'); 
        });
};


const getSuggestions = () => {
fetch('/api/suggestions')
    .then(response => response.json())
    .then(users =>{
        console.log(users)
        const html = users.map(user2Html).join('\n');
        document.querySelector('.suggestions').innerHTML = html;
    });
};

const getProfile = () => {
    
    fetch('/api/profile')
        .then(response => response.json())
        .then(user => {
            console.log(user);
            const html = profile2Html(user);
            document.querySelector('.profile-banner').innerHTML = html;
            document.querySelector('.modal-profile').innerHTML = html;
        })
    };

const getCookie = key => {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        console.log(c);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};



const initPage = () => {
    displayPosts();
    displayStories();
    getSuggestions();
    getProfile();
};

// invoke init page to display stories:
initPage();