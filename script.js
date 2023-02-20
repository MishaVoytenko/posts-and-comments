const comments = []
const authors = ["Alice", "Bob", "Charlie", "David", "Emily", "Frank", "Gina", "Harry", "Isabelle", "Jack", "Elvis"]


fetch('https://jsonplaceholder.typicode.com/posts/')
  .then((response) => response.json())
  .then((posts) => posts.map(addDate))
  .then((posts) => posts.sort((a, b) => a.date - b.date))
  .then((posts) => posts.map(formatDate))
  .then((posts) => show(posts));

function addDate(post) {
  post.date = new Date
  post.date.setDate(random(-400, post.date.getDate()))
  return post
}

function formatDate(post) {
  post.date = post.date.toLocaleDateString('ukr')
  return post
}

function random(min, max) {
  return (Math.random() * (max - min) + min)
}

function show(posts) {
  const ul = document.createElement('ul')

  ul.innerHTML = posts.map(buildPost).join('')

  ul.onclick = comment

  document.body.append(ul)
}

function comment(e) {
  if (e.target.matches('ul, .comment, .comment *, :has(form) *')) return

  showCommentForm(e.target.closest('li'))
}


function buildPost(post) {
  return `
    <li>
      <b class="title">${post.title}</b>
      <p class="text">${post.body}</p>
      <div class="info">
        <b class="author">${authors[post.userId]}</b>
        <span class="date">${post.date}</span>
      </div>
    </li>
  `
}

function showCommentForm(li) {
  const commentWrapper = document.createElement('li')
  const commentForm = document.createElement('form')

  commentWrapper.append(commentForm)
  commentWrapper.classList.add('comment')
  commentForm.innerHTML = `
    <input type="text" name="author" placeholder="your name">
    <textarea name="text" cols="30" rows="10" placeholder="your comment"></textarea>
    <button>submit</button>
  `

  li.insertAdjacentElement('afterend', commentWrapper)
}