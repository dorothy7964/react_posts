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
    this.setState({
      fetching : true // requesting..
    });
    console.log(this.state.fetching);

    // wait for two promises
    const info = await Promise.all([
      service.getPost(postId),
      service.getComments(postId),
    ]);
    console.log(info);

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
    console.log(this.state.fetching);
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
