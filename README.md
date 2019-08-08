# axios 사용법

## GET 요청

```javascript
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

위에서 나온 [.then(...)](http://webframeworks.kr/tutorials/translate/es6-promise-api-1/) 이 문법은 ES6 문법 중 비동기 작업을 좀 더 효율적이고 깔끔한 코드로 작성 할 수 있게 해주는 기능

<br/>

## POST 요청

```javascript
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

위에서 다룬 예제들과 같이, `axios`. 뒤에 `get` 과 `post` 외에도, `delete`, `head`, `post`, `put`, `patch` 메소드를 뒤에 붙여서 사용 할 수 있습니다. 

예: axios.delete(...)

<br/>

## 요청에 옵션을 설정 할 때

```javascript
// Optionally the request above could also be done as
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

<br/>

## 메소드타입을 옵션으로 지정

```javascript
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

<br/>

## Response 스키마 형식

```javascript
{
  // `data` 는 서버에서 반환한 데이터입니다. 
  data: {},

  // `status` 는 서버에서 반환한 HTTP 상태입니다
  status: 200,

  // `statusText` 는 HTTP 상태 메시지입니다
  statusText: 'OK',

  // `headers` 는 서버에서 반환한 헤더값입니다
  headers: {},

  // `config` 는 axios 요청시 전달했던 설정값입니다
  config: {}
}
```

요청이 끝나고 받는 response 는 위와 같은 형식으로 되어있습니다.

<br/>

# API 함수 모듈화하기
axios 를 컴포넌트에서 불러와서 바로 사용을 해도 되는데요,   
저희는 좀 더 코드를 정리해가면서 작성하기 위해서,   
ajax 요청하는 함수들을 따로 만들어서 모듈화하여 **src/services** 디렉토리에 저장하겠습니다.

모듈화 하는 과정은 선택적입니다. 코드를 좀 더 체계적으로 작성하고자 거치는 과정이며,   
본인의 필요에 따라 나중에 컴포넌트 내부에서 바로 요청을 해도 됩니다.

우리가 사용 할 api 들은 포스트 관련 api 니까,   
**post.js** 라는 파일을 생성하고 다음 코드를 입력하세요.

```javascript
import axios from 'axios';

export function getPost(postId) {
    return axios.get('https://jsonplaceholder.typicode.com/posts/' + postId);
}

export function getComments(postId) {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
}
```
**Q. ${...} 은 무슨 표현이죠?**  

위 표현은 ES6 의 [Template Literal](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals) 이라는 문법입니다. 문자열 내부에 변수를 넣을 때 사용합니다.

주의 하실 점은 문자열을 감싸는 따옴표가 숫자 1키 왼쪽에있는 키 입니다

# 컴포넌트에서 API 사용하기

똑똑한 컴포넌트인 **PostContainer** 을 열어서 포스트 내용과 해당 포스트의 덧글들을 불러오는 **fetchPostInfo** 메소드를 만들어봅시다.

```javascript
import React, {Component} from 'react';
import { PostWrapper, Navigate, Post } from '../../components';
import * as service from '../../services/post';


class PostContainer extends Component {

    fetchPostInfo = async (postId) => {
        const post = await service.getPost(postId);
        console.log(post);
        const comments = await service.getComments(postId);
        console.log(comments);
    }

    render() {
        return (
            <PostWrapper>
                <Navigate/>
                <Post/>
            </PostWrapper>
        );
    }
}

export default PostContainer;
```

다음 코드는 아까 작성한 post.js 에서 export 한 함수를 모두 불러와서 service 안에 담습니다.


```javascript
import * as service from '../../services/post';
```

다음 부분은 좀.. 새롭게 느껴지는 분들도 있을겁니다.

```javascript
fetchPostInfo = async (postId) => {
    const post = await service.getPost(postId);
    console.log(post);
    const comments = await service.getComments(postId);
    console.log(comments);
}
```

### 화살표 함수로 컴포넌트 메소드 선언

```javascript
class MyComponent extends Component {
    constructor(props) {
        super();
        this.myMethod = this.myMethod.bind(this);
    }
    myMethod() { ... }
    render() { ... }
}
```

보시다시피 메소드에서 this 에 접근하기 위해 constructor 에서 bind 를 해주었습니다.
 
하지만! 만약에 화살표 함수로 메소드를 선언해주면, binding 을 따로 하지 않아도 자동으로 됩니다.

이는 babel 플러그인 transform-class-properties 가 적용되어있기 때문이구요, create-react-app 으로 만든 프로젝트는 자동으로 적용이 되어있답니다.

### 비동기 작업을 좀 더 쉽게, async-await

이 문법은, 비동기 작업을 마치 동기 작업을 하듯이 코드를 작성 할 수 있게 해줍니다. 보시다시피 callback 이나 promise 가 사용되지 않았죠.

하지만, 코드는 비동기적으로 작동합니다.

여기서 await 키워드는 Promise 를 기다려주는 역할을합니다.   
그리고, 이 키워드를 사용하는 함수는 다음과 같이 함수를 선언 할 때 async 키워드가 함수 앞에 붙어있어야합니다.

```javascript
async function foo() {
  await bar();
}

// OR

const foo = async () => { 
    await bar();
};
```

이렇게 작성된 코드는 babel 플러그인을 통하여 generator 코드로 변형됩니다.

```javascript
var _asyncToGenerator = function (fn) {
  ...
};
var foo = _asyncToGenerator(function* () {
  yield bar();
});
```

자, 이제 제너레이터라는 개념을 이해해야 하는데, 여기에 상세한 설명이 있습니다.

async-await 은 내부적으로 파고들어서 어떻게 작동하는지 원리를 이해를 하려면 조금 어렵습니다.. 이것 저것 많이 읽어보고 실습해봐야 큰 그림이 그려지구요

- await 키워드로 Promise 를 기다린다
-  함수앞에 async 키워드를 붙여준다
-  에러 처리는 try-catch 로 한다
- async 함수의 반환값은 Promise 형태이다

요청의 에러처리를 할 땐 (403, 등의 에러코드 포함) try-catch 문을 사용합니다. 하지만 저희 예제 프로젝트에서는 오류가 날 일이 없으므로

## 컴포넌트의 componentDidMount 에서 메소드 호출

컴포넌트가 로드되고 나서 데이터를 불러오려면, componentDidMount LifeCycle API 에서 데이터를 불러와야합니다. 따라서, componentDidMount 메소드를 만들어서 아까 만든 fetchPostInfo 메소드를 호출하겠습니다.

```javascript
import React, {Component} from 'react';
import { PostWrapper, Navigate, Post } from '../../components';
import * as service from '../../services/post';


class PostContainer extends Component {

    componentDidMount() {
        this.fetchPostInfo(1);
    }
    
    // (...)
}

export default PostContainer;
```

요청이 성공했군요.

fetchPostInfo 메소드의 코드를 보고 이미 눈치채신분들도 있겠지만, 조금 비효율적입니다.

그 이유는, 두번의 비동기 요청을 하는데, 첫번째 요청을 기다린다음에 두번째 요청을 기다리기 때문이죠.

만약에 첫번째와 두번째 요청을 한꺼번에 요청한 다음에 둘 다 기다리면 더 좋지 않을까요?

```javascript
fetchPostInfo = async (postId) => {
    const info = await Promise.all([
        service.getPost(postId),
        service.getComments(postId)
    ]);
    
    console.log(info);
}
```
여러개의 Promise 를 한꺼번에 처리하고 기다릴 때는, Promise.all 을 사용하면 됩니다.

Promise.all 에 promise 의 배열을 전달해주면, 결과값으로 이뤄진 배열을 반환합니다.

결과값의 순서는 Promise.all 에 전달한 배열의 순서와 동일합니다. 지금의 경우 첫번째는 포스트 제목/내용, 두번째는 덧글 내용을 지니고 있겠죠.