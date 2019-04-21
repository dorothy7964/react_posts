import React, {Component} from 'react';
import { PostWrapper, Navigate, Post } from '../../components';
import * as service from '../../services/post';

class PostContainer extends Component {

  constructor(props) {
    super();
    // initializes component state
    this.state = {
      postid : 1,
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
    const info = await Promise.all([
      service.getPost(postId),
      service.getComments(postId),
    ]);
    console.log(info);
  }

  render() {
    return (
      <PostWrapper>
        <Navigate />
        <Post />
      </PostWrapper>
    );
  }
}

export default PostContainer;
