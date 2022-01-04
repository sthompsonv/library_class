const bookContainer = document.querySelector(".book-container");
const bookForm = document.querySelector(".new-book");
const formContainer = document.querySelector(".form-container");
const bookNewButton = document.querySelector('.new-book-button');
const addBookButton = document.querySelector('#add-book-button');
const cancelBookButton = document.querySelector('#cancel-book-button');


bookNewButton.addEventListener("click", newBookHandler);
bookForm.addEventListener("submit", addBookForm);
cancelBookButton.addEventListener("click", cancelForm);


let myLibrary = [];


function Book(title, author, pages, year, description, read, cover) {
  this.id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.year = year;
  this.description = description;
  this.read = read; 
  this.cover = cover;
}


Book.prototype.setId = function(id) {
  this.id = id;
}


function newBookHandler() {
  formContainer.style.visibility = 'visible';
  bookNewButton.removeEventListener("click", newBookHandler);
}


function addBookForm(event) {
  let inputs = parseForm(this);
  let newBook = createBookObject(inputs);

  console.log(`"${newBook.title}" added to library`);

  addBookToLibrary(newBook);
  render();
  event.preventDefault();
  cancelForm();
}


function parseForm(formData) {
  let inputs = [];
  for (element of formData) {
    if (element.type === "text" || element.type === "textarea" || 
      (element.type === "radio" && element.checked)) {
      inputs.push({value: element.value});
    }
  }
  return inputs;
}


function createBookObject(book) {
  if (book[4].value === "") {
    book[4].value = "No description.";
  }
  
  let newBook = new Book(book[0].value, book[1].value, book[2].value, 
    book[3].value, book[4].value, book[5].value, book[6].value);
  
  newBook.setId(myLibrary.length);
  
  return newBook;
}


function addBookToLibrary(book) {
  myLibrary.push(book)
}


function render() {
  bookContainer.innerHTML += generateLibrary(myLibrary[myLibrary.length - 1]);
}
  

function generateLibrary(book) {
  return `
    <article id="${book.id}">
      <div class="overlay">
        <h1 class="display-title">${book.title}</h1>
        <h2 class="display-author">${book.author}</h2>
        <h3 class="display-pages">${book.pages}</h3>
        <h3 class="display-year">${book.year} pages</h3>
        <p class="display-description">${book.description}</p>
        <h3 class="display-read">${book.read}</h3>
      </div>
      <button class="display-edit" onclick="editBookFields(${book.id})">Edit</button>
      <button class="display-remove" onclick="removeBook(${book.id})">Remove</button>
    </article>
  `
}


function cancelForm() {
  bookForm.reset();
  formContainer.style.visibility = "hidden";
  bookNewButton.addEventListener("click", newBookHandler);

  if (addBookButton.innerHTML == "Update") {
    addBookButton.innerHTML = "Add Book";
  }
  
}


function removeBook(id) {
  bookContainer.removeChild(document.getElementById(`${id}`));
}


function editBookFields(id) {

  bookForm.removeEventListener("submit", addBookForm);
  bookForm.addEventListener("submit", addEditedBook);

  formContainer.style.visibility ="visible";
  addBookButton.innerHTML = "Update";

  let book = myLibrary[id];

  document.querySelector("#title").value = book.title;
  document.querySelector("#author").value = book.author;
  document.querySelector("#pages").value = book.pages;
  document.querySelector("#year").value = book.year;
  document.querySelector("#description").value = book.description;
  
  
  if (book.read === 'false') {
    document.querySelector("#read-true").checked = 'false';
    document.querySelector("#read-false").checked = 'true';
  } else {
    document.querySelector("#read-true").checked = 'true';
    document.querySelector("#read-false").checked = 'false';
  }
  
  document.querySelector("#cover").value = book.cover;

  let idDiv = document.createElement('div');
  idDiv.id = `placeHolder-${book.id}`;
  idDiv.style.visibility = 'hidden';
  bookForm.appendChild(idDiv);

  console.log(idDiv);
  console.log(parseInt(idDiv.id.substr(12), 10));

}


function addEditedBook(event) {
  
  let id = parseInt(event.target.lastChild.id.substr(12), 10);
  let book = myLibrary[id];

  console.log(`"${book.title}" edited`);

 
  let inputs = parseForm(this);
  let editedBook = createBookObject(inputs);
  console.log(editedBook);
  console.log(editedBook.id);

  
  let formBookId = document.getElementById(`placeHolder-${id}`)
  
  console.log(formBookId);
 
  formBookId.parentNode.removeChild(formBookId);

  editedBook.id = id;

  myLibrary[editedBook.id] = editedBook;
  
  let oldBook = document.getElementById(`${editedBook.id}`);
  let newBook = document.createRange().createContextualFragment(generateLibrary(myLibrary[editedBook.id]));

  bookContainer.replaceChild(newBook, oldBook);
  
  event.preventDefault();

  bookForm.removeEventListener("submit", addEditedBook);
  bookForm.addEventListener("submit", addBookForm);
  
  cancelForm();
}


