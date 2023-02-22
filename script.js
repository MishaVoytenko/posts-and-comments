const comments = JSON.parse(localStorage.comments || '[]')
const authors = ["Alice", "Bob", "Charlie", "David", "Emily", "Frank", "Gina", "Harry", "Isabelle", "Jack", "Elvis"]
const getNextId = makeIdGenerator(+localStorage.nextId || 1)

fetch('https://jsonplaceholder.typicode.com/posts/')
  .then((response) => response.json())
  .then((posts) => posts.map(addDate))
  .then((posts) => posts.sort((a, b) => a.date - b.date))
  .then((posts) => posts.map(formatDate))
  .then((posts) => show(posts))

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

  comments.forEach(showComment)
}

function comment(e) {
  if (e.target.matches('ul, .comment, .comment *, :has(form) *')) return

  showCommentForm(e.target.closest('li'))
}


function buildPost(post) {
  return `
    <li data-id="${post.id}">
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
  <input type="text" name="author" placeholder="your name" required>
    <textarea name="text" cols="30" rows="10" placeholder="your comment" required></textarea>
    <div>
      <button>submit</button>
      <button type="button">cancel</button>
    </div>
  `.replace(/>\s*</g, '><').trim()
  commentForm.lastChild.lastChild.onclick = () => commentWrapper.remove()

  commentForm.onsubmit = e => {
    const author = commentForm.author.value.trim()
    const text = commentForm.text.value.trim()

    e.preventDefault()
    addComment(author, text, li.dataset.id)
    commentWrapper.remove()
  }
  li.insertAdjacentElement('afterend', commentWrapper)
  li.scrollIntoView({ behavior: 'smooth' })
}

function addComment(author, text, postId) {
  const date = new Date().toLocaleString('ukr').slice(0, -3)
  const id = getNextId()
  const comment = { id, postId, author, text, date }

  comments.push(comment)
  showComment(comment)
  localStorage.comments = JSON.stringify(comments)
}

function showComment({ id, postId, author, text, date }) {
  const li = document.querySelector(`[data-id="${postId}"]:not(.comment)`)
  const commentWrapper = document.createElement('li')

  commentWrapper.classList.add('comment')
  commentWrapper.dataset.id = id
  li.insertAdjacentElement('afterend', commentWrapper)
  commentWrapper.innerHTML = `
    <p class="text">${text}</p>
    <div class="info">
      <b class="author">${author}</b>
      <span class="date">${date}</span>
    </div>
  `
}

function makeIdGenerator(nextId) {
  return () => {
    const id = nextId++

    localStorage.nextId = nextId
    return id
  }
}

