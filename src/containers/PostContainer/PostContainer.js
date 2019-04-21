import React, {Component} from 'react';
import { PostWrapper, Navigate, Post } from '../../components';
import * as service from '../../services/post';

class PostContainer extends Component {

  constructor(props) {
    super();

    // initializes component state
    this.state = {
      postId : 1,
      // tells whether the request is waiting for response or not
      fetching : false,
      post : {
        title : null,
        body : null
      },
      comments : []
    };
  }

  componentDidMount() {
    this.fetchPostInfo(1);
  }

  fetchPostInfo = async (postId) => {
    this.setState({
      fetching : true // requesting..
    });


    // wait for two promises
    const info = await Promise.all([
      service.getPost(postId),
      service.getComments(postId),
    ]);
    console.log(info);
    console.log("비동기 통신 요청 중 : " + this.state.fetching);
    // Object destructuring Syntax,
    // takes out required values and create references to them
    const { title, body } = info[0].data;
    const comments = info[1].data;

    this.setState({
      postId,
      post : {
        title,
        body
      },
      comments,
      fetching : false // done!
    });
    console.log('비동기 통신 요청 끝난 후 : ' + this.state.fetching);
  }

  handleNavigateClick = (type) => {
    const postId = this.state.postId;

    if(type === 'NEXT'){
      this.fetchPostInfo(postId + 1);
    }else {
      this.fetchPostInfo(postId - 1);
    }
  }

  render() {
    const {postId, fetching, post, comments} = this.state;

    return (
      <PostWrapper>
        <Navigate
          postId={postId}
          disabled={fetching}
          onClick={this.handleNavigateClick}
        />
        <Post
          title={post.title}
          body={post.body}
          comments={comments}
        />
      </PostWrapper>
    );
  }
}

export default PostContainer;
